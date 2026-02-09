const { userAuth } = require('../middlewares/userAuth.js');
const { validateUpdateData } = require("../utils/validation.js");

const express = require('express');
const User = require('../models/user.js');
const profileRouter = express.Router();

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




module.exports = { profileRouter };