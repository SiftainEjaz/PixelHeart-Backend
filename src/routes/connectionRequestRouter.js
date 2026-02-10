const express = require('express');
const connectionRequestRouter = express.Router();

const ConnectionRequest = require('../models/connectionRequest.js');
const User = require('..//models/user.js');
const { userAuth } = require('../middlewares/userAuth.js');

connectionRequestRouter.post('/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.existingUser._id;
        const toUserId = req.params.toUserId;

        const status = req.params.status;
        if (!["interested", "ignored"].includes(status)) {
            throw new Error(`${status} is an invalid status!`)
        }
        
        const receiver = await User.findById(toUserId);
        if (!receiver) {
            throw new Error("Invalid User!");
        }
        const existingRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId : toUserId, toUserId : fromUserId},
                {fromUserId : fromUserId, toUserId : toUserId}
            ]
        });
        
        if(existingRequest){
            throw new Error("Connection request already exists!");
        }
        

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })

        const data = await connectionRequest.save();

        if (status === "interested") {
            res.json({
                message: `Connection Request has been sent to ${receiver.firstName}`,
                data
            })
        }

        else {
            res.json({
                message: `You have ignored ${receiver.firstName}`,
                data
            })
        }
    }
    catch (err) {
        res.status(400).json({
            "error": err.message
        })
    }
})

module.exports = { connectionRequestRouter };