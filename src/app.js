const validateSignUpData = require('../utils/validation.js');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const {connectToDB} = require('./config/database.js');
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 2222;

app.post('/signup' , async (req,res) => {
    try{
        validateSignUpData(req);
        
        const existingUser = await User.findOne({emailId : req.body.emailId});
        if(existingUser)
        {
            res.status(400).json({
                "message" : "User already exists!"
            })
        }
        else
        {
            const plainPassword = req.body.password;
            const {firstName, lastName, emailId, gender, age, about, photoUrl} = req.body;
            
            const hashPassword = await bcrypt.hash(plainPassword,10);
            
            const newUser = new User({
                firstName,
                lastName,
                emailId,
                password : hashPassword,
                gender,
                age,
                photoUrl,
                about
            });
            await newUser.save();

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

app.post('/login', async (req,res) => {
    try{
        const {emailId, password} = req.body;
        if(!emailId || !password)
        {
            throw new Error("Please enter the credentials!");
        }
        const existingUser = await User.findOne({emailId});

        if(!existingUser){
            throw new Error("User doesn't exists! Please sign up!");
        }

        else{
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if(isPasswordValid){

                const token = await jwt.sign({_id : existingUser._id},"Pixelheart@$9870");

                res.cookie("token",token);

                res.json({
                    "message" : "Login Successful!",
                })
            }

            else{
                throw new Error("Invalid Credentials!");
            }
        }
    }
    catch(err){
        res.status(404).json({
            "message" : err.message
        })
    }
})


app.get('/profile', async (req,res) => {
    console.log(req.cookies);

    const {token} = req.cookies;

    const decodedPayload = jwt.verify(token,"Pixelheart@$9870");
    console.log(decodedPayload);

    const {_id} = decodedPayload;
    const user = await User.findById(_id);
    
    res.json(user);

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



