const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    ownerId:{ //FK
      type: String,
      required: true
    },
    description:{
      type: String,
      require: true
    },
    duration: {
      type: Number,
      require: true,
      min: [1, 'Duration too high'],
    },
    date:{
      type: Date,
    }
  })

module.exports = exerciseSchema.model('Exercise', exerciseSchema)