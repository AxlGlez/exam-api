const nodemailer = require('nodemailer')

// email sender function
exports.sendEmail = async function (req, res) {
  // Definimos el transporter
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    // host: 'smtp.gmail.com', // Office 365 server
    // port: 465, // secure SMTP
    // secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })
  // Definimos el email
  var mailOptions = {
    from: ``,
    to: process.env.RECIBE_MAIL, // req.email,
    // to: req.email,
    subject: `Contacto`,
    text: `Mensaje de contacto`,
    html: ``
  }
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error)
      res.send(500, error.message)
    } else {
      // console.log('Email sent')
      res.status(200).jsonp(req.body)
    }
  })
}
