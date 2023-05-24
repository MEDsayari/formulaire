const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nomDeFamille: { type: String, required: true },
  adresseEmail: { type: String, required: true },
  motDePasse: { type: String, required: true },
  resetCode : {type:String},
  Derniereconnexion: {
    type: Date,
    default: null
  }
});

userSchema.methods.generateAuthToken = function () {
	const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
		expiresIn: "1m",
	});
	return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const messages = {
    "string.base": "{#label} doit être une chaîne de caractères.",
    "string.empty": "{#label} ne doit pas être vide.",
    "string.email": "{#label} doit être une adresse email valide.",
    "any.required": "{#label} est obligatoire.",
    "passwordComplexity.tooShort":
      "{#label} doit contenir au moins 8 caractères.",
    "passwordComplexity.uppercase":
      "{#label} doit contenir au moins 1 lettre majuscule.",
    "passwordComplexity.lowercase":
      "{#label} doit contenir au moins 1 lettre minuscule.",
    "passwordComplexity.numeric":
      "{#label} doit contenir au moins 1 chiffre.",
    "passwordComplexity.symbol":
      "{#label} doit contenir au moins 1 caractère spécial.",
  };

	const schema = Joi.object({
    prenom: Joi.string().required().messages(messages),
    nomDeFamille: Joi.string().required().messages(messages),
    adresseEmail: Joi.string().email().required().messages(messages),
    motDePasse: passwordComplexity().required().messages(messages),
  });
	return schema.validate(data);
};



module.exports = { User, validate }

