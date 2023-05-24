const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const nodemailer = require('../nodemailer/nodemailer.config')


router.post("/", async (req, res) => {
	try {
		console.log(req.body);
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ adresseEmail: req.body.adresseEmail });
		if (!user)
			return res.status(401).send({ message: "Invalid Email " });

		const validPassword = await bcrypt.compare(
			req.body.motDePasse,
			user.motDePasse
		);
		if (!validPassword)
			return res.status(401).send({ message: "Invalid  Password" });

		const token = user.generateAuthToken(user._id);
		user.Derniereconnexion = Date.now();
		await user.save();
		res.status(200).send({ data: token, message: "logged in successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		adresseEmail: Joi.string().email().required().label("adresseEmail"),

		motDePasse: Joi.string().required().label("motDePasse"),
	});
	return schema.validate(data);
};



router.get("/last-login", async (req, res) => {
	console.log(req.body);
	try {
		const user = await User.findOne({}, {}, { sort: { Derniereconnexion: -1 } });
		if (!user) {
			return res.status(404).send({ message: "Aucun utilisateur n'a encore connecté" });
		}
		res.status(200).send({ data: user._id });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}
});


// route hetha envoyé email 

router.post('/reset_password', async (req, res) => {
	console.log(req.body);
	const characters =
		"0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
	let randomCode = "";
	for (let i = 0; i < 25; i++) {
		randomCode += characters[Math.floor(Math.random() * characters.length)];
	}

	await User.findOneAndUpdate({ adresseEmail: req.body.email }, { resetCode: randomCode }, { new: true }).then(user => {
		if (user) {
			nodemailer.sendResetPasswordEmail(req.body.email, randomCode)
			res.send({ msg: "email de reinitisation envoyé avec succes ! " })
		} else {
			res.send({ msg: "aucun compte est associé avec cette email" });
		}
	})




})

// route changer l password

router.put("/reset_password/:resetCode", async (req, res) => {
	console.log(req.body);
	const salt = await bcrypt.genSalt(10);
	if (!salt) throw Error("Something went wrong with bcrypt");
	const hash = await bcrypt.hash(req.body.password, salt);
	if (!hash) throw Error("Something went wrong hashing the password");

	await User.findOneAndUpdate(
		{ resetCode: req.params.resetCode },
		{ motDePasse: hash },
		{
			new: true,
		}
	).then((user) => {
		if (user) {
			return res.send({
				message: "mot de passe mis a jour avec succés !",
			});
		} else {
			return res.send({
				message: "le code de reinitialisation est faux !",
			});
		}
	});
});



module.exports = router;

