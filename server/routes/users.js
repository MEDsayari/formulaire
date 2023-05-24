const router = require("express").Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ adresseEmail: req.body.adresseEmail });
		
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.motDePasse, salt);

		await new User({ ...req.body, motDePasse: hashPassword }).save();
		res.status(201).send({ message: "User created successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
});
router.get("/:id", async (req, res) => {
	try {
	  const user = await User.findById(req.params.id);
	  if (!user) {
		return res.status(404).send({ message: "User not found" });
	  }
	  res.send(user);
	} catch (error) {
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });

  router.get('/latest', async (req, res) => {
	try {
	  const latestUser = await User.findOne().sort({_id: -1});
	  res.json(latestUser);
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ message: 'Une erreur est survenue lors de la récupération du dernier utilisateur.' });
	}
  });

router.put("/:id", async (req, res) => {
	try {
	  const { id } = req.params;
	  const { adresseEmail, nomDeFamille, prenom } = req.body;
  
	  // Mettre à jour les champs email, lastname et firstname de l'utilisateur
	  const user = await User.findByIdAndUpdate(
		id,
		{ adresseEmail, nomDeFamille, prenom },
		{ new: true }
	  );
  
	  if (!user) {
		return res.status(404).send({ message: "Utilisateur non trouvé." });
	  }
  
	  res.send({ message: "Utilisateur mis à jour avec succès.", user });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({
		message: "Une erreur est survenue lors de la mise à jour de l'utilisateur."
	  });
	}
  });
  
  router.delete("/:id", async (req, res) => {
	try {
	  const user = await User.findByIdAndDelete(req.params.id);
	  
	  if (!user)
		return res.status(404).send({ message: "User not found" });
		
	  res.status(200).send({ message: "User deleted successfully" });
	} catch (error) {
	  res.status(500).send({ message: "Internal Server Error" });
	}
  });
module.exports = router;