const nodemailer = require('nodemailer');

const send = async (req, res, next) => {
    const transport = nodemailer.createTransport({
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

    let send = await transport.sendMail({
        from: 'kuya_will@shoppee.com', // sender address
        to: "renz.martin_cerico@tailinsubic.net", // list of receivers
        subject: "Important Reminder", // Subject line
        text: "Important Reminder", // plain text body
        html: `<!DOCTYPE html>
        <html>
        <body>
        
        <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;"> <iframe style="width:100%;height:100%;position:absolute;left:0px;top:0px;overflow:hidden" frameborder="0" type="text/html" src="https://www.dailymotion.com/embed/video/x7oi9om" width="100%" height="100%" allowfullscreen > </iframe> </div>
        
        </body>
        </html>
        `, // html body
        priority: 'high'
      }).catch(err => {
          console.log(error);
          next(err);
      });    
      console.log(send);
    next(send);
    // transport.verify((err,success) => {
    //     if(err) {
    //         next(err)
    //     } else {
    //         next('connected');
    //     }
    // });
};

module.exports.send = send;

const createTestAccount = (req, res, next) => {
    nodemailer.createTestAccount().then(response => {
        res(200).json(response);
    }).catch(err => {
        next(err);
    });
};

module.exports.createTestAccount = createTestAccount;