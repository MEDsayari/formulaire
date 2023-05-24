const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  categorie:{
    type: String,
    required: true,
  },
  typeReponse:{
    type: String,
    required: false,
  },
  options: [{
    type: String,
    required: true,
  }],
});

module.exports = mongoose.model('Question', questionSchema);
