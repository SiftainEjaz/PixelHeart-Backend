const { userAuth } = require('../middlewares/userAuth.js');

const express = require('express');
const profileRouter = express.Router();

profileRouter.get('/view', userAuth, async (req, res) => {
    try{
        const existingUser = req.existingUser;

        res.json({
            "message" : "Profile fetched successfully!",
            existingUser
        })        
    }
    catch(err){
        res.status(400).json({
            "message" : err.message
        })
    }
})


module.exports = {profileRouter};