
// add the code for send emial to the user through nodemailer
const nodemailer = require('nodemailer');
const sendEmail = async (to,subject,text,html) => {
    const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: process.env.Email, // Your email address
    pass: process.env.Password // Your email password 
  },
});

// Wrap in an async IIFE so we can use await.
(async () => {
  try {
    const info = await transporter.sendMail({
      from: 'arslanakramsoftwareengineer@gmail.com', 
      to,
      subject, 
      text, 
      html 
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
})();
};

module.exports = sendEmail;