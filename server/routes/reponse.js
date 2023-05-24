const express = require('express');
const router = express.Router();
const Reponse = require('../models/reponsemodel');
const Question=require('../models/questmodel')
router.post('/add', async (req, res, next) => {
  try {
    const { formId, reponse, visiteurId } = req.body;
    const forbiddenWords = ['foo', 'bar', 'baz'];
    const inputValues = reponse.map(r => r.value).flat();
    const forbiddenValues = forbiddenWords.filter(word => inputValues.includes(word));
    
    if (forbiddenValues.length > 0) {
      res.status(400).json({ message: 'Forbidden words detected', forbiddenValues: forbiddenValues });
      return;
    }

    const reponseData = {
      formId,
      reponse: [],
      visiteurId,
    };

    // Créer une liste de promesses pour valider chaque réponse
    const validationPromises = reponse.map(async (r) => {
      const question = await Question.findById(r.questionId);


      // Valider la réponse en fonction du type de réponse de la question
      let value = r.value;
      if (question.categorie==='text'){
      switch (question.typeReponse) {
        case 'nombre':
          if (isNaN(value)) {
            throw new Error(`La réponse à la question '${question.question}' doit être un nombre.`);
          }
          break;
        case 'text':
          console.log(value[0])
          if (typeof value[0] !== 'string' || /^\d+$/.test(value)) {
            throw new Error(`La réponse à la question '${question.question}' doit être du texte.`);
          }
          break; 
        case 'date':
          if (isNaN(Date.parse(value))) {
            throw new Error(`La réponse à la question '${question.question}' doit être une date.`);
          }
          value = new Date(value);
          break;
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            throw new Error(`La réponse à la question '${question.question}' doit être une adresse email valide.`);
          }
          break;
        default:
          // Si le type de réponse n'est pas valide, retourner une erreur
          throw new Error(`La question '${question.question}' a un type de réponse non valide.`);
      }
    }
      // Retourner la réponse validée
      return {
        questionId: r.questionId,
        value: value,
      };
    });

    // Attendre que toutes les validations soient terminées
    const reponses = await Promise.all(validationPromises);

    // Ajouter toutes les réponses validées à l'objet reponseData
    reponseData.reponse = reponses;

      // Enregistrer les réponses validées dans la base de données
      const newReponse = new Reponse(reponseData);
      const savedReponse = await newReponse.save();
      res.status(201).json({ message: 'Réponse enregistrée avec succès.', reponse: savedReponse });
  } catch (err) {
    // Si une erreur se produit, retourner une réponse d'erreur
    res.status(400).json({ message: err.message });
  }
});


router.get ('/get/:formId' ,async (req,res)=>{
  try {
    const reponse = await Reponse.find({ formId: req.params.formId });
    res.status(200).json(reponse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la récupération des Reponse." });
  }

});



router.get('/stat/:formId', async (req, res) => {
  try {
    const radioQuestions = await Question.find({
      formId: req.params.formId,
      categorie: { $in: ['radio', 'checkbox'] },
    }).exec();

    let radioResponses = [];

    await Promise.all(
      radioQuestions.map(async (question) => {
        // Get réponses for every question
        const responses = await Reponse.find({
          'reponse.questionId': question._id,
        }).lean().exec();
    
        // Get values
        const values = responses.flatMap((response) => response.reponse.find((item) => item.questionId.equals(question._id)).value);
    
        // Check if values exist
        if (values.length > 0) {
          // Stats Logic
          const stats = values.reduce((acc, item) => {
            const option = question.options.find((option) => option === item);
            if (option) {
              const existingResponse = acc.find((obj) => obj.value === option);
              if (existingResponse) {
                existingResponse.count += 1;
              } else {
                acc.push({ value: option, count: 1 });
              }
            }
            return acc;
          }, []);
    
          // Push every question with its stats
          radioResponses.push({ ...question, stats });
        }
      })
    );
    

    res.json({ radioQuestions, radioResponses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while retrieving the statistics.' });
  }
});

module.exports = router;


