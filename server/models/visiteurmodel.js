const mongoose = require('mongoose');

const schemaVisiteur = mongoose.Schema({
  formId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  }],
  numeroTelephone: {
    type: String,
    required: true, 
  }
});

module.exports = mongoose.model('Visiteur', schemaVisiteur);
