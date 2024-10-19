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
        const query = await DbUser.findOne({ name: user.name})
        res.status(200).send(query)
    }catch (err){
        console.error(err)
        res.status(404).send({error:"User not found"})
    }
})

server.post('/pass', async (req,res) =>{
    const user = {name: req.body.name, password: req.body.password, newPassword: req.body.newPassword}
    if (!user){
        return res.status(400).send({error:'Username is required'})
    }
    try {
        const query = await DbUser.updateOne({name: user.name, password: user.password},
            {password: user.newPassword})
        if (query.matchedCount === 0)
        {
            res.status(404).send({error:"User not found"})
        }
        res.status(200).send({message: "Password updated"})
    }catch(err){
        console.error(err)
        res.status(404).send({error:"Internal error"})
    }
})

server.post("/newUser", async (req,res)=>{
    const user = {name: req.body.name, password: req.body.password, role:"user"}
    if (!user){
        return res.status(400).send({error:'Username is required'})
    }
    try {
        const query = await DbUser.create(user)
        res.status(200).send({message: "User added"})
    }catch (e) {
        console.log(e)
        res.status(404).send({error:"Internal error"})
    }
})

server.listen(3000)



