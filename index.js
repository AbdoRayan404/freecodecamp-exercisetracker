const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const app = express()
const {create_new_user, create_new_exercise, get_users, get_log} = require('./models/DataController')

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
app.post('/api/users', create_new_user)

//Usage: GET '/api/users'
//Returns: Array of Users [{_id:'21312-21312-123',username:'terry-404'}]
app.get('/api/users', get_users)

//Usage: POST '/api/users/:_id/exercises' with 
//Form{
//  _id: string (required)
//  description: string (required)
//  duration: int (required)
//  date: Date (optional)  
//}
//Returns:
app.post('/api/users/:_id/exercises', create_new_exercise)

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
app.get('/api/users/:_id/logs', get_log)


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
