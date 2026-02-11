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


connectionRequestSchema.index({fromUserId : 1, toUserId : 1})

connectionRequestSchema.pre("save" , function() {
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Connection Request cannot be sent to own account.")
    }
})

const ConnectionRequest = mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequest;