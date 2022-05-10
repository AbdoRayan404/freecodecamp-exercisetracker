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

const exerciseModel = mongoose.model('Exercise', exerciseSchema)

module.exports = exerciseModel