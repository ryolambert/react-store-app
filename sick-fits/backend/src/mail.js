/* --------------------MAILER SETUP FILE----------------------------------
|  Purpose: Configuration/Setup file for our mailer functionality on the  
|  server. Utilizes nodemailer and hooks up to our mailing service for 
|  password resets.
*-----------------------------------------------------------------------*/
const nodemailer = require('nodemailer');

// * Sets up a one way email send
const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// ! Setting up our mailing templates
// TODO: integrate custom mailing templates
// ⚛ Option 1-  mjml.io
// ^ Option 2- Pug/Juice (html/css templating)

// ? Alternate Syntax: "exports.makeANiceEmail"
const emailTemplate = text => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
  ">
  <h2>Hello There!</h2>
  <p>${text}</p>
  <p>👋, Ryo Lambert</p>
  </div>
`;

// * Exports our transport
exports.transport = transport;
exports.emailTemplate = emailTemplate;
