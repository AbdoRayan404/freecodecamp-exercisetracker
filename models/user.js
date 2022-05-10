const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id:{ //PK
      type: String
    },
    username:{
      type: String,
      unique: true,
      required: true
    }
  })

module.exports = userSchema.model('User', userSchema)