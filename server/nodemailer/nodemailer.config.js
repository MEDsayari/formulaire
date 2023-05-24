const nodemailer = require('nodemailer')
const user ="creationformulaire@gmail.com"
const pass ="nocpjqmnnkihdbjo"

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user:user,
        pass:pass
},
})

module.exports.sendResetPasswordEmail = (email,randomCode) => {
    transport
    .sendMail({
      from: user,
      to: email,
      subject: "Demande reinitialisation du mot de passe  ",
      html: `
      <div>
      <h1> Réinitialisation du mot de passe </h1>
      
        <p>reinitialiser votre  mot de passe en cliquant sur le lien suivant
</p>
        <a href=http://localhost:3000/reset_password/${randomCode}>Cliquez ici
</a>

        </div>`,
    })
    .catch((err) => console.log(err));
}

