const ScrappedEventSchema = require("../models/scraping");
const axios = require("axios");
const cheerio = require("cheerio");
const { allunverisities } = require("../json");
const generalScraping = async () => {
  for (const uni of allunverisities) {
    console.log(`Scraping ${uni.name}...`);
    await ScrappedEventSchema.deleteMany({ name: uni.name });
    let events = [];

    if (uni.type === "page") {
      // MUL style
      for (let page = 1; page <= uni.pagination; page++) {
        const pageUrl = page === 1 ? uni.url : `${uni.url}/page/${page}`;
        try {
          const { data: html } = await axios.get(pageUrl);
          const $ = cheerio.load(html);
          $(".rbt-card.event-list-card").each((i, el) => {
            events.push({
              name: uni.name,
              title: $(el).find(".rbt-card-title a").text().trim() || null,
              link: $(el).find(".rbt-card-title a").attr("href") || null,
              date: $(el).find(".rbt-meta li").first().text().trim() || null,
              description: $(el).find("p").text().trim() || null,
              image: $(el).find(".rbt-card-img img").attr("src") || null
            });
          });
        } catch (err) {
          console.error(`Error fetching ${pageUrl}:`, err.message);
        }
      }

    } else if (uni.type === "fast") {
  // FAST/NU style with detail page date scraping
  try {
    const { data: html } = await axios.get(uni.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const $ = cheerio.load(html);

    // Use for...of loop instead of .each() to handle async operations
    const containers = $(uni.selectors.container);
    for (let i = 0; i < containers.length; i++) {
      const el = containers[i];
      const $el = $(el);

      // Get the link element correctly
      const linkElement = $el.find(uni.selectors.link);
      const relativeLink = linkElement.attr('href');
      
      if (!relativeLink) continue; // Skip if no link found

      const absoluteLink = new URL(relativeLink, uni.url).href;

      // Get title from the h5 inside the link
      const title = linkElement.find('h5').text().trim();

      // Handle image
      let imgSrc = $el.find(uni.selectors.image).attr('src');
      if (imgSrc && !imgSrc.startsWith('http')) {
        imgSrc = new URL(imgSrc, uni.url).href;
      }

      const description = $el.find(uni.selectors.description).text().trim();

      // Initialize date variable
      let extractedDate = null;

      // Try to get date from detail page
      try {
        // console.log(`Fetching detail page: ${absoluteLink}`);
        
        const { data: detailHtml } = await axios.get(absoluteLink, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          },
          timeout: 10000, // 10 second timeout
          validateStatus: function (status) {
            return status < 500; // Don't throw error for 404, but do for 500
          }
        });

        const $detail = cheerio.load(detailHtml);

        // Method 1: Look for calendar icon followed by paragraph
        extractedDate = $detail('i.fa-calendar').next('p').text().trim();
        
        // Method 2: If above fails, look in the card header area
        if (!extractedDate) {
          extractedDate = $detail('.card-header.mainNews').find('p.d-inline').text().trim();
        }

        // Method 3: Look for any paragraph near calendar icon
        if (!extractedDate) {
          $detail('i.fa-calendar').each((j, icon) => {
            const $icon = $(icon);
            const possibleDate = $icon.parent().find('p').text().trim();
            if (possibleDate && !extractedDate) {
              extractedDate = possibleDate;
            }
          });
        }

        // Method 4: Try to find date-like patterns in the entire content
        if (!extractedDate) {
          const content = $detail.html();
          const datePatterns = [
            /(\w+\. \d+, \d{4})/, // "Jun. 24, 2025"
            /(\w+ \d+, \d{4})/,   // "June 24, 2025"
            /(\d{1,2}\/\d{1,2}\/\d{4})/, // "6/24/2025"
            /(\d{4}-\d{2}-\d{2})/ // "2025-06-24"
          ];
          
          for (const pattern of datePatterns) {
            const match = content.match(pattern);
            if (match) {
              extractedDate = match[1];
              break;
            }
          }
        }

        console.log(`Date found for "${title}": ${extractedDate}`);

      } catch (err) {
        if (err.response && err.response.status >= 500) {
          console.error(`Server error (${err.response.status}) for: ${absoluteLink}`);
        } else {
          console.error(`Error fetching detail page ${absoluteLink}:`, err.message);
        }
        
        // Fallback: try to extract date from description
        const dateMatch = description.match(/On (\w+ \d+, \d{4})/i);
        if (dateMatch) {
          extractedDate = dateMatch[1];
        }
      }

      // Add delay between requests to be polite to the server
      if (i < containers.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      events.push({
        name: uni.name,
        title: title || null,
        link: absoluteLink,
        date: extractedDate,
        description: description || null,
        image: imgSrc || null
      });
    }
  } catch (err) {
    console.error(`Error fetching main page ${uni.url}:`, err.message);
  }
}else if (uni.type === "single") {
      // UCP style
      try {
        const { data: html } = await axios.get(uni.url);
        const $ = cheerio.load(html);
        $(uni.selectors.container).each((i, el) => {
          const $el = $(el);
          const $img = $el.find(uni.selectors.image);


          const imgSrc =
            $img.attr('data-lazy-src') ||
            $img.attr('data-src') ||
            $img.attr('srcset')?.split(' ')[0] ||
            $img.attr('src') ||
            null;

          events.push({
            name: uni.name,
            title: $el.find(uni.selectors.title).text().trim() || null,
            link: $el.find(uni.selectors.link).attr("href") || null,
            date: $el.find(uni.selectors.dateTime).text().trim() || null,
            description: $el.find(uni.selectors.description).text().trim() || null,
            image: imgSrc
          });
        });
      } catch (err) {
        console.error(`Error fetching ${uni.url}:`, err.message);
      }
    } else if (uni.type === "iub") {
      // IUB style paginated events
      try {
        for (let page = 1; page <= uni.pagination; page++) {
          const pageUrl = `${uni.url}?page=${page}`;
          try {
            const { data: html } = await axios.get(pageUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
              }
            });

            const $ = cheerio.load(html);

            $(uni.selectors.container).each((i, el) => {
              const $el = $(el);

              // Extract image URL (handle potential lazy loading)
              let imgSrc = $el.find(uni.selectors.image).attr('src') ||
                $el.find(uni.selectors.image).attr('data-src');

              // Clean up title text (removes extra whitespace)
              const title = $el.find(uni.selectors.title).text().replace(/\s+/g, ' ').trim();

              // Extract date (remove icon text if present)
              let date = $el.find(uni.selectors.date).text().trim();
              date = date.replace(/^\s*(?:[^\w]+\s*)?/, ''); // Remove leading icons/text

              events.push({
                name: uni.name,
                title: title || null,
                link: $el.find(uni.selectors.link).attr('href') || null,
                date: date || null,
                category: $el.find(uni.selectors.category).text().trim() || null,
                description: $el.find(uni.selectors.description).text().trim() || null,
                image: imgSrc || null
              });
            });

            // Add delay between pages to be polite
            await new Promise(resolve => setTimeout(resolve, 1000));

          } catch (err) {
            console.error(`Error fetching IUB page ${page}:`, err.message);
          }
        }
      } catch (err) {
        console.error(`Error in IUB scraper:`, err.message);
      }
    }

    if (events.length) {
      await ScrappedEventSchema.insertMany(events);
      console.log(`${events.length} events saved for ${uni.name}`);
    } else {
      console.log(`No events found for ${uni.name}`);
    }
  }
};

async function getsepcificEvents(req, res) {
  const { uniname } = req.params;
  const searchQuery = req.query.search;
  // console.log(`Fetching events for university: ${uniname} with search query: ${searchQuery}`);
  try {
    // convert uniname to lowercase and schema name to lowercase
    const events = await ScrappedEventSchema.find({ name: uniname.toLowerCase() });
    // console.log(events);
    if (searchQuery &&
      searchQuery !== "undefined" &&
      searchQuery !== "null") {
      console.log(`Filtering events with search query: ${searchQuery}`);
      // event.title.toLowerCase().includes(searchQuery.toLowerCase())
      const filteredEvents = events.filter(event =>
        event._id==searchQuery);
      return res.status(200).json(filteredEvents);
    }
    return res.status(200).json(events);
  } catch (err) {
    console.error("Error fetching Mul events:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function globalSearchTitle(req, res) {
  const title = req.query.query;
  console.log("Searching for events with title:", title);
  try {
    const events = await ScrappedEventSchema.find({
      title: { $regex: title, $options: "i" }
    });
    console.log(events.length);

    return res.status(200).json(events);
  } catch (err) {
    console.error("Error searching events:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function comparativeEventsSearch(req,res){
  console.log("Searching for events with title:", req.params.eventname);
 try { const {eventname}=req.params;
  const getAllEvents=await ScrappedEventSchema.find();
  const filteredEvents=getAllEvents.filter(event=>event.title && event.title.toLowerCase().includes(eventname.toLowerCase()));
  // console.log(filteredEvents);
  return res.status(200).json(filteredEvents);
} catch (err) {
  console.error("Error searching events:", err.message);
  return res.status(500).json({ error: "Internal server error" });
}
}
module.exports = { getsepcificEvents, generalScraping, globalSearchTitle, comparativeEventsSearch };