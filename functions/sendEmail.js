const nodemailer = require('nodemailer');

function sendEmail(to, subject, output) {
  let transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secureConnection: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS_EMAIL,
    },
  });

  let mailOptions = {
    from: 'Auth app Contact',
    to: to,
    subject: subject,
    text: 'Auth app',
    html: output,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
  });
}

module.exports = sendEmail;