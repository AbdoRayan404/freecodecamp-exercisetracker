const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const mongoose = require('mongoose');

const app = express()
const User = require('./models/user')
const Exercise = require('./models/exercise')


require('dotenv').config()
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

mongoose.connect(process.env.MONGO_URI)

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

//////////////////////
//    API routes    //
//////////////////////

app.post('/api/users', (req, res)=>{
  
  //check if username is provided
  if(!req.body.username){
    res.json({'error':'Please provide a username'})
    return;
  }

  let newUUID = uuidv4();

  //creating user document
  const newUser = new User({
    _id: newUUID,
    username: req.body.username
  })

  //saving the user document
  newUser.save((err,data)=>{
    if(err) console.log(err);
    if(data){
      res.json({username:req.body.username, _id:newUUID})
    }
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
