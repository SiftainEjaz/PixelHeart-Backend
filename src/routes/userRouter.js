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

        const loggedInUser = req.existingUser;

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        const skip = (page - 1) * limit;

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

        const users = await User.find({
            $and: [
                { _id: { $ne: loggedInUser._id } },
                { _id: { $nin: Array.from(hideUsersFromFeed) } }
            ]
        }).select("firstName lastName age about skills gender").skip(skip).limit(limit);

        res.send(users);
    }
    catch (err) {
        res.send(err.message);
    }
})



module.exports = { userRouter };