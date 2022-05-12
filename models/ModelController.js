const User = require('./user');
const Exercise = require('./exercise');
const { v4: uuidv4 } = require('uuid');

///////////////////
//  MIDDLEWARES  //
///////////////////

let InputError = {"error": 'Your input is not correct'}

//takes: username
//returs created user Object
const create_new_user = (req, res, next) => {
  let username = req.body.username

  if(username){
    let newUUID = uuidv4();

    //creating user document
    const newUser = new User({
      _id: newUUID,
      username: username
    })
  
    //saving the user document
    newUser.save((err,data)=>{
      if(err) console.log(err);
      if(data){
        res.json({'username':data.username, '_id':data._id})
      }
    })
  }else{
    res.json(InputError)
  }

}

//takes: id, duration, description, date(oprtional)
//returns: created objects
const create_new_exercise = (req, res, next) => {
  let id = req.params._id
  let date = req.body.date
  let duration = req.body.duration
  let description = req.body.description

  User.findOne({_id: id}, (err, data) =>{
    if(err) console.log(err);
    //user not found || found
    if(!data){res.json({'error':"this userId doesn't exists."})}
    else{

      let nowDate = new Date()
      if(date){
        nowDate = new Date(date)
      }

      //ceating new exercise document
      const newExercise = new Exercise({
        ownerId: id,
        description: description || 'default description', //in case of not entering a description
        duration: duration || 1, //in case of not entering a duration
        date: nowDate
      })

      //saving the exercise document
      newExercise.save((err, saved)=>{
        if(err) {
          console.log(err)
          res.json({'error':'there was an error saving the exercise'})
        }
        if(saved){
          res.json({_id:data._id, username:data.username, date:new Date(saved.date).toDateString(), duration:saved.duration, description:saved.description})
        }
      })
    }
  })
}

const get_users = (req, res, next)=>{
    User.find({}, (err, data) =>{
        if(err) console.log(err);
        if(data){
          res.json(data)
        }
    })
}

const get_log = (req, res, next)=>{
    let from = req.query.from;
    let to = req.query.to;
    let limit = req.query.limit
  
    let id = req.params._id
    
    //if from exists then change it's format
    if(from){
      from = new Date(from)
    }
  
    if(to){
      to = new Date(to)
    }
  
  
    //if user exists
    User.findOne({_id: id}, (err, user)=>{
      if(err) console.log(err)
  
      if(!user) res.json({'error': "this userId doesn't exists."})
      else{
        //find user Exercises
        Exercise.find({ownerId: id, date: {"$gte": from || new Date('1450-1-1'), "$lt": to || new Date('2300-1-1')}}, (err, log)=>{
          if(err) console.log(err)
          if(log){
            let formatedLog = log.map((v)=>({
              description: v.description,
              duration: v.duration,
              date: v.date.toDateString()
            }))
            res.json({_id: user._id, username:user.username, count: log.length, log:formatedLog})
          }
          
        }).limit(limit || 100)
      }
    })
}
module.exports = {create_new_user, create_new_exercise, get_users, get_log}