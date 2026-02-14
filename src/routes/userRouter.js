const express = require('express');
const userRouter = express.Router();

const { userAuth } = require('../middlewares/userAuth.js');
const ConnectionRequest = require('../models/connectionRequest.js');
const User = require('../models/user.js');

userRouter.get('/connections', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.existingUser;
        const connections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id, status: "accepted" },
                { toUserId: loggedInUser._id, status: "accepted" }
            ]
        })
            .populate("fromUserId", ["firstName", "lastName", "about", "age", "skills", "photoUrl"])
            .populate("toUserId", "firstName lastName about age skills photoUrl");

        if (connections.length == 0) {
            throw new Error("No connections found!");
        }


        const connectionsData = (connections).map((connection) => {
            if ((connection.fromUserId._id).equals(loggedInUser._id)) {
                return connection.toUserId;
            }

            return connection.fromUserId;
        })

        res.json({
            message: `${connections.length} connection(s) found!`,
            connectionsData
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


userRouter.get('/feed', userAuth, async (req, res) => {
    try {
        //users whom we have sent connection request
        //users from whom we have received connection request
        //users who are a connection
        //users whom we have rejected

        const loggedInUser = req.existingUser;

        // const connections = await ConnectionRequest.find({
        //     $or: [
        //         { fromUserId: loggedInUser._id, status: "accepted" },
        //         { toUserId: loggedInUser._id, status: "accepted" }
        //     ]
        // })

        // const requestReceived = await ConnectionRequest.find({ toUserId: loggedInUser._id, status: "interested" });

        // const requestSent = await ConnectionRequest.find({ fromUserId: loggedInUser._id, status: "interested" });

        // const ignoredUsers = await ConnectionRequest.find({ fromUserId: loggedInUser._id, status: "ignored" });

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId");


        const hideUsersFromFeed = new Set();

        connectionRequests.forEach((connectionRequest) => {
            hideUsersFromFeed.add(connectionRequest.fromUserId.toString());
            hideUsersFromFeed.add(connectionRequest.toUserId.toString());
        })

        // console.log(hideUsersFromFeed);

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUsersFromFeed) } }
            ]
        }).select("firstName lastName age about skills gender");

        res.send(users);
    }
    catch (err) {
        res.send(err.message);
    }
})



module.exports = { userRouter };