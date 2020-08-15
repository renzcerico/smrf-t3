class template {
    // receiver = '';
    // mail_content = '';
    // mail_action_link = '';
    // mail_action_text = '';
    // objID = null;
    // type = '';
    constructor(type, params) {
        this.type = type;
        this.receiver = params.receiver;
        this.sender = params.sender;
        this.objID = params.objID;
        this.types = {
            'job_request_created': {
                'mail_content': 'You have a new job request. You can view it by clicking the button below.',
                'mail_action_link': 'http://service.tailinsubic.com/requests/',
                'mail_action_text': 'view job request'
            }
        }
    }

    generateTemplate() {
        const receiver_name = this.receiver;
        const mail_content = this.types[this.type].mail_content;
        const mail_action_link = this.types[this.type].mail_action_link + this.objID;
        const mail_action_text = this.types[this.type].mail_action_text;
        return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                .header {
                    text-transform: uppercase;
                    color: #673ab7;
                    font-weight: 500;
                    font-size: larger;
                    width: 100%;
                    text-align: center;
                    font-family:'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
                }

                .action-button{
                    text-decoration: none;
                    text-align: center;
                    width: 100% !important;
                    padding: 6px 0;
                    background-color: #673ab7;
                    border: 1px solid #673ab7;
                    border-radius: 100px;
                    color: #fff;
                    display: block;
                    font-size: 20px;
                    font-weight: bolder;
                }
                body {
                    padding: 10px 40px 10px 30px;
                    font-family: sans-serif;
                }
            </style>
        </head>
        <body>
            <div class="header">
                smrf notification
            </div>
            <hr>
            <h3 class="greeting">
                Hi, ${receiver_name}
            </h3>
            <p class="content">
                ${mail_content}
            </p>

            <a class="action-button" href="${mail_action_link}" style="width:100%;">${mail_action_text}</a>

            <p class="action-backup">Or by using this link: <a href="${mail_action_link}">${mail_action_text}</a></p>
        </body>
        </html>`;
    }
}

module.exports = template;