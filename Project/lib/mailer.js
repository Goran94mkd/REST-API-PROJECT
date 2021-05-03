const nodemailer = require('nodemailer');
const events = require('events');
const emitter = new events.EventEmitter();

module.exports = () => { 

  const transporter = nodemailer.createTransport({
    service: 'hotmail',
    host: 'smtp.office365.com',
    port: 465,
    tls: {
      rejectUnauthorized: false
    },
    auth: {
      user: 'ws-gen-11@outlook.com',
      pass: 'ws-gen-edinaeset'
    }
  });

  const sendMail = () => {

    const email = {
      from: 'ws-gen-11@outlook.com',
      to: 'ws-gen-11@outlook.com',
      text: 'New email'
    };

    transporter.sendMail(email, function (error) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent successfully');
      }
    });
  }

  emitter
    .on('blogpost_created', data => {
      sendMail();
    })

  emitter.emit('blogpost_created')
}