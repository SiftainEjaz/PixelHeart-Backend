const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/userAuth.js');
const ConnectionRequest = require('../models/connectionRequest.js');

userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.existingUser;
        const connections = await ConnectionRequest.find(
            { toUserId: loggedInUser._id, status: "accepted" }
        ).populate("fromUserId", ["firstName", "lastName"]);

        if(connections.length == 0){
            throw new Error("No connections found!");
        }

        res.json({
            message : `${connections.length} connection(s) found!`,
            connections
        })
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
})

userRouter.get('/requests/received', userAuth, async (req, res) => {
    try {
        //toUserId = loggedInUser._id && status = "interested"
        const loggedInUser = req.existingUser;

        const connectionRequests = await ConnectionRequest.find(
            { toUserId: loggedInUser._id, status: "interested" })
            .populate("fromUserId", "firstName lastName about age skills photoUrl");


        if (connectionRequests.length == 0) {
            throw new Error("No pending requests!");
        }

        res.json({
            message: `${connectionRequests.length} connections request(s) found!`,
            connectionRequests
        })

    }
    catch (err) {
        res.status(400).json({
            message: err.message
        })
    }
})



module.exports = { userRouter };