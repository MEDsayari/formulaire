const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  slug:{
  type:String,
  required:true
  },
  titreForm: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true 
  },
  userId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: false 
  }
  
});

module.exports = mongoose.model('Form', formSchema);
