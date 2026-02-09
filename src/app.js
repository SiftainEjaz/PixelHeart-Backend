const express = require('express');
const cookieParser = require('cookie-parser');
const { connectToDB } = require('./config/database.js');
const { userAuth } = require('./middlewares/userAuth.js');
const {authRouter} = require('./routes/authRouter.js');
const {profileRouter} = require('./routes/profileRouter.js');

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = 2222;

app.use('/' , authRouter);
app.use('/profile',profileRouter);


// app.get('/profile', userAuth, async (req, res) => {

//     try {
//         const existingUser = req.existingUser;

//         res.json({
//             "message": "Profile fetched successfully!",
//             existingUser
//         });
//     }
//     catch (err) {
//         res.status(400).json({
//             "message": err.message
//         })
//     }
// })

 
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



