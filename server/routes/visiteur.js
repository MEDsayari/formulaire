const express = require('express');
const router = express.Router();
const Visiteur=require('../models/visiteurmodel')
const Reponse=require('../models/reponsemodel')
// Create new visitor and save to database
// POST request to create a new visitor
router.post('/add', async (req, res) => {
  try {
    const { formId, numeroTelephone } = req.body;

    // Check if the phone number is a number
    if (isNaN(numeroTelephone)) {
      return res.status(202).json({ message: 'Le numéro de téléphone doit être un nombre.' });
    }

    // Check if visitor with phone number and formId already exists
    const existingVisitor = await Visiteur.findOne({ numeroTelephone });
    if (existingVisitor) {
      if (existingVisitor.formId.includes(formId)) {
        // Check if there's already a response for this visitor and form
        const existingResponse = await Reponse.findOne({ visiteurId: existingVisitor._id, formId });
        if (existingResponse) {
          return res.status(400).json({ message: 'Le visiteur avec ce numéro de téléphone a déjà rempli ce formulaire.' });
        } else {
          return res.status(201).json({ message: 'Le visiteur a déjà été enregistré avec succès.' });
        }
      } else {
        existingVisitor.formId.push(formId);
        await existingVisitor.save();
        return res.status(200).json({ message: 'Le visiteur a été mis à jour avec succès.' });
      }
    }
    // Create new visitor and save to database
    const newVisitor = new Visiteur({ formId: [formId], numeroTelephone });
    await newVisitor.save();
    res.status(200).json({ message: 'Le visiteur a été créé avec succès.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Une erreur est survenue lors de la création du visiteur.' });
  }
});


router.get('/get/latest', async (req, res) => {
  try {
    const visiteur = await Visiteur.findOne().sort({ _id: -1 }).populate('formId');
    res.json(visiteur);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});


module.exports=router;