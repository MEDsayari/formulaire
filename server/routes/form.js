const express = require('express');
const router = express.Router();
const Form = require('../models/formmodel');
const User =require('../models/user')
router.post('/add', async (req, res) => {
  try {
    const { slug,titreForm, description, userId } = req.body;
    if (!titreForm || !description ) {
      return res.status(400).json({ message: 'Veuillez fournir un titre et une description.' });
    }
   
    const formExists = await Form.findOne({ slug });
    if (formExists) {
      return res.status(400).json({ message: 'Un formulaire avec ce titre existe déjà.' });
    }
    const newForm = new Form({
      slug,
      titreForm,
      description,
      userId 
    });

    await newForm.save();

    res.status(201).json({ message: 'Le formulaire a été créé avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});



  router.get('/latest', async (req, res) => {
    try {
      const latestForm = await Form.findOne().sort({ _id: -1 });
      res.status(200).json(latestForm);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la récupération du dernier formulaire." });
    }
  })
  

  router.get('/get',async (req, res) => {
    try {
      const data = await Form.find()
      res.status(201).json(data)
    } catch (error) {
      console.log(error.message)
    }
  })

  router.get('/get/:id',async (req, res) => {
    try {
      const data = await Form.findOne({ _id: req.params.id })
      res.status(201).json(data)
    } catch (error) {
      console.log(error.message)
    }
   
  })
  router.get('/user/:userId', async (req, res) => {
    try {
      const forms = await Form.find({ userId: req.params.userId });
      res.status(200).json(forms);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Une erreur est survenue lors de la récupération des formulaires." });
    }
  });




  

module.exports = router;
