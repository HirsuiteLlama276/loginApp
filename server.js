var express = require('express');
const server = express()
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
server.use(express.json())
server.use(bodyParser.json())
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
const DbUser = mongoose.model('Cyb', userSchema);

server.post('/login',  async (req, res) => {

    const user = {name: req.body.name, password: req.body.password}
    if (!user){
        return res.status(400).send({error:'Username is required'})
    }
    try{
        const test = await DbUser.findOne({ name: user.name})
        res.status(200).send(test)
    }catch (err){
        console.error(err)
        res.status(404).send({error:"User not found"})
    }
})

server.listen(3000)



