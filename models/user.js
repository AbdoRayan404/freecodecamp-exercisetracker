const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id:{ //PK
      type: String
    },
    username:{
      type: String,
      required: true
    }
  })

const userModel = mongoose.model('User', userSchema)

module.exports = userModel