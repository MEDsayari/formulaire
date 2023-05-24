const mongoose = require('mongoose');

const reponseSchema = mongoose.Schema({

  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  reponse: [
    {

      questionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
      },
      value: [{
        type: String,
        required: true
      }]

    }
  ],
  visiteurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visiteur',
    required: true
  }

});

module.exports = mongoose.model('Reponse', reponseSchema);