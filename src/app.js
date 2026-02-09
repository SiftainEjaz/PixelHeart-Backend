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



