const nodemailer = require('nodemailer');
const template = require('./template');

class mailer {
    // transport = null;
    constructor() {
        this.transport = nodemailer.createTransport({
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
    }

    sendMail(type, params) {
        const htmltemplate = new template(type, {
            receiver: params.receiver,
            sender: params.sender,
            objID: params.objID
        });
        return new Promise((resolve, reject) => {
            this.transport.sendMail({
                from: 'no-reply@service.tailinsubic.com',
                to: params.receiverEmail,
                subject: 'SMRF Notification',
                html: htmltemplate.generateTemplate(),
                priority: params.priority || 'normal'
            }, (err, info) => {
                if (err) {
                    reject(err);
                } else {
                    resolve('email sent');
                }
            });
        });
    }
}

module.exports = mailer;