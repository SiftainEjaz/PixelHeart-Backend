const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { connectToDB } = require('./config/database.js');
const { authRouter } = require('./routes/authRouter.js');
const { profileRouter } = require('./routes/profileRouter.js');
const { connectionRequestRouter } = require('./routes/connectionRequestRouter.js');
const { userRouter } = require('./routes/userRouter.js');

require('dotenv').config();

const app = express();
app.use(cors({
    origin : ["https://pixelheart.in", "http://localhost:5173"],
    credentials : true
}));

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use('/', authRouter);
app.use('/profile', profileRouter);
app.use('/request', connectionRequestRouter);
app.use('/user', userRouter);

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



