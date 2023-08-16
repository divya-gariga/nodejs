const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adverseactionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'CONSIDER'],
    required: true
  },
  prenotice_date: {
    type: Date,
    required: true
  },
  postnotice_date: {
    type: Date,
    required: true
    },
});


module.exports = mongoose.model('Adverseaction', adverseactionSchema);