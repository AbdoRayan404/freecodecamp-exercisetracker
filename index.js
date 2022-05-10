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

//Usage: POST '/api/users' with Form data (username:XXX)
//Returns: {username:XXX, _id:UUID}
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

//Usage: GET '/api/users'
//Returns: Array of Users [{_id:'21312-21312-123',username:'terry-404'}]
app.get('/api/users', (req, res)=>{
  User.find({}, (err, data) =>{
    if(err) console.log(err);
    if(data){
      res.json(data)
    }
  })
})

//Usage: POST '/api/users/:_id/exercises' with 
//Form{
//  _id: string (required)
//  description: string (required)
//  duration: int (required)
//  date: Date (optional)  
//}
//Returns:
app.post('/api/users/:_id/exercises', (req, res)=>{
  //check if userId exists
  User.findOne({_id:req.params._id}, (err, data) =>{
    if(err) console.log(err);
    //user not found || found
    if(!data){res.json({'error':"this userId doesn't exists."})}
    else{
      //check if there's date supplied
      if(!req.body.date){
        req.body.date = new Date().toDateString()
      }else{
        req.body.date = new Date(req.body.date).toDateString()
      }

      //ceating new exercise document
      const newExercise = new Exercise({
        ownerId: req.params._id,
        description: req.body.description || 'default description', //in case of not entering a description
        duration: req.body.duration || 1, //in case of not entering a duration
        date: req.body.date
      })

      //saving the exercise document
      newExercise.save((err, saved)=>{
        if(err) console.log(err);
        if(saved){
          res.json({_id:data._id, username:data.username, date:new Date(saved.date).toDateString(), duration:saved.duration, description:saved.description})
        }
      })
    }
  })

})

//Usage: GET '/api/users/:_id/logs' Optional query params:
//from= Date yyyy-mm-dd
//to= Date yyyy-mm-dd
//limit= int
//Returns: Object wtih array:
//{_id:string, username:string, count:int,
//log:[{
//  description:string,
//  duration: int,
//  date: Date.toDateString()
//}]}
app.get('/api/users/:_id/logs', (req,res)=>{
  let from = req.query.from;
  let to = req.query.to;
  let limit = req.query.limit
  
  //if from exists then change it's format
  if(from){
    from = new Date(from).toDateString()
  }else{
    from = new Date('1999-1-1').toDateString()
  }

  if(to){
    to = new Date(to).toDateString()
  }else{
    to = new Date('2999-1-1').toDateString()
  }


  //if user exists
  User.findOne({_id: req.params._id}, (err, user)=>{
    if(err) console.log(err)

    if(!user) res.json({'error': "this userId doesn't exists."})
    else{
      //find user Exercises
      Exercise.find({ownerId: req.params._id, date: {"$gte": from, "$lt": to}}, (err, log)=>{
        if(err) console.log(err)
        if(log){
          let newLog = []

          //doing this to avoid working with dumb dates converting and fomratting and all of this JAZZ
          log.forEach((value, index, arr) =>{
            newLog.push({description: log[index].description, duration: log[index].duration, date: new Date(log[index].date).toDateString()})
          })

          res.json({_id: user._id, username:user.username, count: newLog.length, log:newLog})
        }
        
      }).limit(limit)
    }
  })

})


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
