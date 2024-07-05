const nodemailer = require("nodemailer")
const fs = require("fs")
const ejs = require("ejs")

const sendEmailUsers = async (emails, data, emailTemplate, subject, emailSendFrom = null) => {
    try {
    if (!emails || emails.length === 0) {
    throw new Error("No recipients defined");
    }
    
    const sesRegion = 'ap-south-1'
    // Create a transporter using AWS SES SMTP
    const transporter = nodemailer.createTransport({
        host: `email-smtp.${sesRegion}.amazonaws.com`, // AWS SES SMTP endpoint
        port: 465, // Port for TLS/STARTTLS
        secure: true,
        auth: {
            user: "AKIASR2CUTHJJQFFQRXZ",
            pass: "BAclq1i9ou6pVZsj24NWMBEAjftGSGbj2OXu8n6K7kq4"
        }
    });
    
    const template = fs.readFileSync(__dirname + `/email/${emailTemplate}.ejs`, 'utf-8');
    
    // Send email to each recipient
    for (const email of emails) {
    // Render the template with the data for each recipient
    const renderedEmail = ejs.render(template, data);
    
    const emailSendFromMail = emailSendFrom ? `"Team Via" <${emailSendFrom}>` : `"Team Via" <gauravbrar506@gmail.com>`;
    
    const mailOptions = {
    from: '"Plot Bazaar" <info@farmlandbazaar.com>',
    to: email,
    subject: subject,
    html: renderedEmail
    };
    
    await transporter.sendMail(mailOptions);
    console.log("Email has been sent to:", email);
    }
    
    } catch (error) {
    console.log("Error occurred while sending email:", error);
    return error;
    }
    };
    

  module.exports = sendEmailUsers