const { userAuth } = require('../middlewares/userAuth.js');
const validateSignUpData = require('../utils/validation.js');
const User = require('../models/user.js');

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

module.exports = {authRouter};