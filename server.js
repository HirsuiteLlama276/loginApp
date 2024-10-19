var express = require('express');
const server = express()
const mongoose = require('mongoose');
server.use(express.json())
require('dotenv').config();

mongoose.uri
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));
const userSchema = new mongoose.Schema(
    {
        name: String,
        password: String,
        role: String,
    },{collection: 'users'}
);
const DbUser = mongoose.model('Cyb',userSchema);

const users  = []

server.get('/users',(req, res) =>{
  res.json(users)
})

server.get('/status',(req, res) =>{
  res.json({status:'Working'})
})

DbUser.find({ name: 'admin' })
    .then(user => {
        console.log(user); // The document returned from the query
    })
    .catch(err => {
        console.error(err); // Handle any errors
    });

server.post('/login', async (req, res) => {
    try{
        const user = {name: req.body.name, password: req.body.password}
        //findUser(user.name)
        const test = await DbUser.findOne({name:user.name})
        if (!test){
            return res.status(404).json({message: "User not found"})
        }
        res.status(200)
    }catch (err){
        console.error(err)
        res.status(500)
    }
    /*
    DbUser.findOne({name:user.name}, function (err,users) {
        if (err) {
            console.log(err);
        } else {
            console.log(users)
            res.status(201).send()
        }
    })
*/
})

server.listen(3000)



