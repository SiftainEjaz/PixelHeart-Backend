const validateSignUpData = require('../utils/validation.js');
const express = require('express');
const {connectToDB} = require('./config/database.js');
const User = require('./models/user.js');

const app = express();
app.use(express.json());

const PORT = 2222;

app.post('/signup' , async (req,res) => {

    //Validate Signup Data
    
    //Encrypt Password

    try{
        validateSignUpData(req);
        
        const users = await User.findOne({emailId : req.body.emailId});
        if(users)
        {
            res.status(400).json({
                "message" : "User already exists!"
            })
        }
        else
        {
            const user = new User(req.body);
            await user.save();

            res.json({
                "message" : "User added successfully!!"
            })
        }
    }
    catch(err){
        res.status(400).json({
            "message" : "Something went wrong!!",
            "error" : err.message
        })
    }
})

app.get('/feed' , async (req,res) => {
    try{
        const users = await User.find();
        res.json(users);
    }
    catch(err){
        res.status(400).json({
            "message" : "Something went wrong!",
            "error" : err.message
        })
    }
})

app.delete('/user' , async (req,res) => {
    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndDelete(userId);
            res.json({
            "message" : "User deleted successfully!"
            })
    }
    catch(err){
        res.status(400).json({
            "message" : "Something went wrong!",
            "error" : err.message
        })
    }
})

app.patch('/user/:userId' , async (req,res) => {
    const dataToBeUpdated = req.body;
    const userId = req.params?.userId;
    
    try{
        const Allowed_Updates = ["firstName", "lastName", "about", "skills", "age", "photoUrl" , "gender" , "password"];

        const isUpdateAllowed = Object.keys(dataToBeUpdated).every((key) => Allowed_Updates.includes(key));

        if(!isUpdateAllowed)
        {
            throw new Error("Updates not allowed for added fields!");
        }
        if(dataToBeUpdated?.skills?.length > 10)
        {
            throw new Error("Maximum of 10 skills can be added!");
        }
        else
        {
            const user = await User.findByIdAndUpdate(userId,dataToBeUpdated,{runValidators : true});
            res.json({
                "message" : "User updated successfully!"
            })
        }
    }
    catch(err){
        res.status(401).json({
            "message" : "Something went wrong!",
            "error" : err.message
        })
    }
})


connectToDB()
.then(() => {
    console.log("Database connection established..");
    app.listen(PORT , () => {
        console.log(`Server is listening on PORT : ${PORT}`);
    })
})
.catch((err) => {
    console.error("Database connection cannot be established!!" +err);
})



