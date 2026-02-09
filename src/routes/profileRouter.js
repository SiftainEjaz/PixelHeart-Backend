const { userAuth } = require('../middlewares/userAuth.js');
const { validateUpdateData } = require("../utils/validation.js");

const express = require('express');
const User = require('../models/user.js');
const profileRouter = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');

profileRouter.get('/view', userAuth, async (req, res) => {
    try {
        const existingUser = req.existingUser;

        res.json({
            "message": "Profile fetched successfully!",
            existingUser
        })
    }
    catch (err) {
        res.status(400).json({
            "message": err.message
        })
    }
})

profileRouter.patch('/update', userAuth, async (req, res) => {
    try {
        validateUpdateData(req);

        const existingUser = req.existingUser;
        const updatedUser = await User.findByIdAndUpdate(existingUser._id, req.body, { runValidators: true, returnDocument: 'after' });

        res.json({
            message: `${existingUser.firstName},your profile has been updated successfully!`,
            data : updatedUser
        })

    }
    catch (err) {
        res.status(400).json({
            "message": err.message
        })
    }
})

profileRouter.patch('/password' , userAuth, async (req,res) => {
    try{
        const newPassword = req.body.password;
        const existingUser = req.existingUser;

        const oldHashPassword = existingUser.password;
        const isPasswordSame = await bcrypt.compare(newPassword,oldHashPassword);

        if(isPasswordSame){
            throw new Error("Same Password!! Please enter a new password.");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("Please enter a Strong Password!");
        }

        const newHashPassword = await bcrypt.hash(newPassword,10);
        await User.findByIdAndUpdate(existingUser._id,{password : newHashPassword},{runValidators : true});

        res.json({
            message : `Password has been updated!`
        })
    }

    catch(err){
        res.status(404).json({
            message : err.message
        })
    }

})


module.exports = { profileRouter };