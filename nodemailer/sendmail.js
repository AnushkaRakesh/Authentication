const res = require('express/lib/response');
const nodemailer = require('nodemailer');


module.exports.sendEmail = (user,token)=>{
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "anushkarakesh8812@gmail.com", // generated ethereal user
              pass:"catjnxsrlizyoobl", // generated ethereal password
            },
          });

        let info = transporter.sendMail({
            from: '"User Auth"<anushkarakesh8812@gmail.com>', // sender address
            to: user.email, 
            subject: "Reset Password", 
            html: `<p>Hii ${user.name} please click here to <a href="http://localhost:5500/users/reset-password?token=${token}">Reset</a>your password</p>`, 
        });
        console.log('message sent ',info.messageId);
           

    } catch (error) {
        console.log('error in nodemailer',error);
    }
}