const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({

    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["interested","ignored","accepted","rejected"],
            message : '{VALUE} is an invalid status!'
        }
    }

},{timestamps : true});

connectionRequestSchema.pre("save" , function () {
    const connectionRequest = this;

    if((connectionRequest.fromUserId).equals(connectionRequest.toUserId)){
        throw new Error("You cannot send connection request to yourself!");
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;