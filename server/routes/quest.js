const express = require('express');
const router = express.Router();
const Question = require('../models/questmodel');

// POST request to create a new question
router.post('/add', async (req, res) => {
  try {
    const { question, formId, categorie,typeReponse, options } = req.body;
    const newQuestion = new Question({
      question,
      formId,
      categorie,
      typeReponse,
      options,
    });
    await newQuestion.save();
    console.log(req.body);
    res.status(200).json({ message: 'La question a été créé avec succès.' })
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la création de la question." });
  }
});


router.get('/get', async (req, res) => {
  try {
    const questions = await Question.find(); // récupère toutes les questions depuis la base de données
    res.status(200).json({ questions }); // envoie les données des questions dans la réponse
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération des questions." });
  }
});

router.get('/getById/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id); // récupère la question par son ID depuis la base de données
    res.status(200).json({ question }); // envoie les données de la question dans la réponse
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération de la question." });
  }
});

// http://localhost:5000/quest/get/${formId}`
router.get('/get/:formId', async (req, res) => {
  try {
    const questions = await Question.find({ formId: req.params.formId });
    res.status(200).json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération des questions." });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findOne({_id: req.params.id}).select('question'); // récupère la propriété "question" de la question par son ID depuis la base de données
    if (!question) {
      return res.status(404).json({ message: "La question demandée n'a pas été trouvée." });
    }
    res.status(200).json({ question }); // envoie la propriété "question" dans la réponse
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération de la question." });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: "La question n'a pas été trouvée." });
    }
    res.status(200).json({ message: "La question a été supprimée avec succès.", id: deletedQuestion._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la suppression de la question." });
  }
});
/*******************************************************/
router.put('/update/:id', async (req, res) => {
  try {
    const { question, formId, categorie, typeReponse, options } = req.body;
    const id = req.params.id.trim(); // supprimer les caractères de retour à la ligne
    const updatedQuestion = await Question.findByIdAndUpdate(id, {
      question,
      formId,
      categorie,
      typeReponse,
      options,
    }, { new: true });
    if (!updatedQuestion) {
      return res.status(404).json({ message: "La question n'a pas été trouvée." });
    }
    res.status(200).json({ message: "La question a été mise à jour avec succès.", question: updatedQuestion });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la mise à jour de la question." });
  }
});







  
  
    






module.exports = router 