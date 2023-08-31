const nodeMailer = require('../config/nodemailer');

// this is another method of exporting a method
exports.newComment = (comment) => {
    // console.log('inside newComment mailer', comment);
    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comment.ejs')

    nodeMailer.transporter.sendMail({
        from: 'prathikshetty1411@gmail.com',
        to: comment.user.email,
        subject: "New Comment Published!",
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log('Error in sending the mail', err);
            return;
        }
        // console.log('Mail delivered', info);
        return;
    });
}