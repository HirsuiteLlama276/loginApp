const express = require('express');
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

server.post('/EditPass', async (req,res) =>{
    const user = {name: req.body.name, password: req.body.password, passwordNew: req.body.passwordNew}
    if (!user){
        return res.status(400).send({error:'Username is required'})
    }
    try {
        const query = await DbUser.updateOne({name: user.name, password: user.password},
            {password: user.passwordNew})
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
        res.status(500).send({error:"Internal error"})
    }
})
server.post("/editUser", async (req,res)=>{
    const user = {name: req.body.name, role: req.body.role,
        nameNew: req.body.nameNew, passwordNew: req.body.passwordNew, roleNew: req.body.roleNew}
    try{
        const query = await DbUser.updateOne({name:user.name, role: user.role},
            {name: user.nameNew,password: user.passwordNew, role: user.roleNew})
        if (query.modifiedCount === 0)
        {
            res.status(404).send({error:"User not found"})
        }
        res.status(200).send({message:"User edited!"})
    }catch (e) {
        console.log(e)
        res.status(500).send({error:"Internal error"})
    }
})

server.get("/users", async (req,res) =>{
    try{
        const query = await DbUser.find({})
        res.status(200).send({query})
    }catch (e) {
        console.log(e)
        res.status(404).send({error:"Users not found!"})
    }
})

server.listen(3000)



