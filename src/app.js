const validateSignUpData = require('./utils/validation.js');
const express = require('express');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const { connectToDB } = require('./config/database.js');
const User = require('./models/user.js');
const jwt = require('jsonwebtoken');
const {userAuth} = require('./middlewares/userAuth.js');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 2222;

app.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req);

        const existingUser = await User.findOne({ emailId: req.body.emailId });
        if (existingUser) {
            res.status(400).json({
                "message": "User already exists!"
            })
        }
        else {
            const plainPassword = req.body.password;
            const { firstName, lastName, emailId, gender, age, about, photoUrl, skills } = req.body;

            const hashPassword = await bcrypt.hash(plainPassword, 10);

            const newUser = new User({
                firstName,
                lastName,
                emailId,
                password: hashPassword,
                gender,
                age,
                photoUrl,
                about,
                skills
            });
            await newUser.save();

            res.json({
                "message": "User added successfully!!"
            })
        }
    }
    catch (err) {
        res.status(400).json({
            "message": "Something went wrong!!",
            "error": err.message
        })
    }
})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        if (!emailId || !password) {
            throw new Error("Please enter the credentials!");
        }
        const existingUser = await User.findOne({ emailId });

        if (!existingUser) {
            throw new Error("User doesn't exists! Please sign up!");
        }

        else {
            const isPasswordValid = await bcrypt.compare(password, existingUser.password);
            if (isPasswordValid) {

                const token = await jwt.sign({ _id: existingUser._id }, "Secure!@$1560");

                res.cookie("token", token);

                res.json({
                    "message": "Login Successful!",
                })
            }

            else {
                throw new Error("Invalid Credentials!");
            }
        }
    }
    catch (err) {
        res.status(404).json({
            "message": err.message
        })
    }
})


app.get('/profile', userAuth ,async (req, res) => {

    try {
        const existingUser = req.existingUser;

        res.json({
            "message": "Profile fetched successfully!",
            existingUser
        });
    }
    catch (err) {
        res.status(400).json({
            "message": err.message
        })
    }
})


connectToDB()
    .then(() => {
        console.log("Database connection established..");
        app.listen(PORT, () => {
            console.log(`Server is listening on PORT : ${PORT}`);
        })
    })
    .catch((err) => {
        console.error("Database connection cannot be established!!" + err);
    })



