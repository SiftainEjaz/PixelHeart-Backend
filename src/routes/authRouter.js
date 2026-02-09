const { userAuth } = require('../middlewares/userAuth.js');
const validateSignUpData = require('../utils/validation.js');
const User = require('../models/user.js');

const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);
        
        const { firstName, lastName, emailId, password, gender, skills, age, about, photoUrl } = req.body;

        const existingUser = await User.findOne({emailId});

        if(existingUser){
            throw new Error("User already exists!");
        }
        
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            emailId,
            password : hashPassword,
            age,
            gender,
            skills,
            about
        })

        await newUser.save();

        res.json({
            "message" : "User added successfully!"
        })
        
    }
    catch (err) {
        res.status(400).json({
            "message" : err.message
        })
    }
})

authRouter.post('/login' , async (req,res) => {
    try{
        const {emailId, password} = req.body;

        if(!emailId || !password){
            throw new Error("Please enter the credentials!");
        }

        const existingUser = await User.findOne({emailId});
        
        if(!validator.isEmail(emailId)){
            throw new Error("Invalid Email ID!");
        }
        if(!existingUser){
            throw new Error("User doesn't exists. Please sign up!");
        }

        const isPasswordValid = await bcrypt.compare(password,existingUser.password);

        if(!isPasswordValid){
            throw new Error("Incorrect credentials!");
        }

        const token = jwt.sign({_id : existingUser._id}, "Secure!@$1560", {expiresIn : "1d"});

        res.cookie("token" , token);
        res.json({
            "message" : "User logged in successfully!",
        })

    }
    catch(err){
        res.status(400).json({
            "message" : err.message
        })
    }
})


module.exports = {authRouter};