const nodemailer = require("nodemailer")
const fs = require("fs")
const ejs = require("ejs")

const sendEmailadmin = async(email,  emailTemplate, subject, emailSendFrom = []) => {
    try{
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

        const template = fs.readFileSync(__dirname + `/email/${emailTemplate}.ejs`, 'utf-8')

        //Render the template with the data and send email notification
        const renderedEmail = ejs.render(template)

        const emailSendFromMail = emailSendFrom ?  `"Team Via" <${emailSendFrom}>` : `"Team Via" <gauravbrar506@gmail.com>`
        
        const mailOptions = {
            from: '"Plot Bazaar" <info@farmlandbazaar.com>',
            to : email,
            subject : subject,
            html : renderedEmail
        }

        transporter.sendMail(mailOptions, (err, info) => 
         err 
         ? console.log(err)
         : console.log("mail has been sent : " + email + " " + info.response)
        )

    }catch(error){
        console.log("email not sent");
        console.log(error);
        return error
    }
}

const EmailMultipleUsers = async(email, emailTemplate, subject, emailSendFrom = []) => {
    try{
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
        const template = fs.readFileSync(__dirname + `/email/${emailTemplate}.ejs`, 'utf-8')

        //Render the template with the data and send email notification
        const renderedEmail = ejs.render(template)

        const emailSendFromMail = emailSendFrom ?  `"Team Via" <${emailSendFrom}>` : `"Team Via" <gauravbrar506@gmail.com>`
        
        const mailOptions = {
            from: '"Farmland Bazaar" <info@farmlandbazaar.com>',
            to : email,
            subject : subject,
            html : renderedEmail
        }

        transporter.sendMail(mailOptions, (err, info) => 
         err 
         ? console.log(err)
         : console.log("mail has been sent : " + email + " " + info.response)
        )

    }catch(error){
        console.log("email not sent");
        console.log(error);
        return error
    }
}

  module.exports = EmailMultipleUsers

  module.exports = sendEmailadmin