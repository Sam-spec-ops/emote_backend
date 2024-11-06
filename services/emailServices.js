const nodemailer = require("nodemailer");
// const transporter = nodemailer.createTransport({
//     host: 'smtp.gmail.com',
//     port: 465,
//     secure: true, // true for 465, false for other ports
//     auth: {
//       user: process.env.EMAIL_ADDRESS,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});
module.exports = transporter;
