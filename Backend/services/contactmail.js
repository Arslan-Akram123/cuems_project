
// add the code for send emial to the user through nodemailer
const nodemailer = require('nodemailer');
const usersendEmail = async (useremail,text) => {
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
  from: process.env.Email, // must match authenticated account
  to: '2021f-mulbscs-167@mul.edu.pk',
  subject: "User Problems Message",
  text,
  html: "<p>" + text + "</p>",
  replyTo: useremail // replies go to the user
});

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail", err);
  }
})();
};

module.exports = usersendEmail;