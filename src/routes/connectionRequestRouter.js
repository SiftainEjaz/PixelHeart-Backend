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
            $or: [
                { fromUserId: toUserId, toUserId: fromUserId },
                { fromUserId: fromUserId, toUserId: toUserId }
            ]
        });

        if (existingRequest) {
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
                message: `You are interested in ${receiver.firstName}. Connection Request has been sent.`,
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

connectionRequestRouter.patch('/review/:status/:fromUserId', userAuth, async (req, res) => {
    try {

        const loggedInUser = req.existingUser;
        const fromUserId = req.params.fromUserId;
        const status = req.params.status;
        if (!["accepted", "rejected"].includes(status)) {
            throw new Error(`${status} is of invalid type!`);
        }

        const findUser = await User.findById(fromUserId);
        if (!findUser) {
            throw new Error("User doesn't exists in the platform!");
        }
        const connectionRequest = await ConnectionRequest.findOneAndUpdate({ fromUserId: fromUserId, toUserId: loggedInUser._id, status: "interested" }, { status: status }, { returnDocument: "after", runValidators: true });

        if (!connectionRequest) {
            throw new Error("No request found!");
        }

        res.json({
            message: `${findUser.firstName}'s connection request has been ${status}!`,
            connectionRequest
        })

    }
    catch (err) {
        res.status(400).json({
            error: err.message
        })
    }
})



module.exports = { connectionRequestRouter };