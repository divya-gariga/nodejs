const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courtsearchSchema = new Schema({
            search: {   
                type: String,
                required: true
            },
            status: {
                type: String,
                enum: ['CLEAR', 'CONSIDER'],
                required: true
            },
            created_date: {
                type: Date,
                required: true
            },
        candidate_id: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: 'Candidate'
        }
});


module.exports = mongoose.model('Courtsearch', courtsearchSchema);