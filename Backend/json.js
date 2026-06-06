const allunverisities = [
  {
    name: "mul",
    url: "https://www.mul.edu.pk/en/news-events",
    pagination: 13,
    type: "page" 
  },
  {
    name: "ucp",
    url: "https://ucp.edu.pk/ucp-today/",
    type: "single", 
    selectors: {
      container: ".grid-item.ucp-today-box",  
      title: "h3 a",
      link: "h3 a",
      dateTime: ".ucp-today-metas span",
      image: "img",
      description: "p" 
    }
  },
  {
    name: "iub",
    url: "https://www.iub.edu.pk/events",
    pagination: 42, 
    type: "iub", 
    selectors: {
      container: ".single-item-wrapper",  
      title: "h3.item-title a",
      link: "h3.item-title a",
      date: "span:has(i.fa-calendar)", 
      category: "span.label a", 
      description: "p.item-content",
      image: ".courses-img-wrapper img"
    }
  },
  // {
  //   name: "fast",
  //   url: "https://lhr.nu.edu.pk/news/",
  //   type: "fast", 
  //   selectors: {
  //     container: ".card-body",  
  //    title: "a.color-nu-dark h5",        
  //    link: "a.color-nu-dark",
  //     description: "p",
  //     image: "img.newsImage",
  //     date: null 
  //   }
  // }
];

module.exports = { allunverisities };
