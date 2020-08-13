var nodemailer = require('nodemailer');

const send = async (req, res, next) => {
    try {
        const transporter = nodemailer.createTransport({
                host: 'mail.tailinsubic.net',
                port: 587,
                secure: false,
                auth: {
                    user: 'auth@tailinsubic.net',
                    pass: 'G(w^=%PU'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
    
        var mailOptions = {
            from: 'auth@tailinsubic.net',
            to: 'renz.martin_cerico@tailinsubic.net',
            subject: 'SERVICE MAINTENANCE - TAILIN',
            text: 'Yes Sir!',
            html: `<h2>Hello,</h2>
                   <p>These are the requirements for the service.</p>
                   <p><br /><a style="background: #673ab7; padding: 14px 18px; font-weight: 600; color: white; border: 0; text-align: center;">VIEW &nbsp; &rarr; </a> <br /><br /><br /></p>
                   <footer style="background: #673ab7; padding: 10px; color: white; text-align: center; font-weight: 500;">&copy; 2020 Service Maintenance - Tailin</footer>`,
        };
          
        let info = await transporter.sendMail(mailOptions);

        console.log("Message sent: %s", info.messageId);
        res.status(200).json(info);
    } catch (err) {
        next(err);
    }
};

module.exports.send = send;