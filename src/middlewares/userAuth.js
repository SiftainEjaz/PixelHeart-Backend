const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const userAuth = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            return res.status(401).json({
                message : "Session Expired. Please Login!"
            })
        }
        else{
            const decodedPayload = jwt.verify(token,"Secure!@$1560");
            const {_id} = decodedPayload;

            const existingUser = await User.findById(_id);

            if(!existingUser){
                throw new Error("User doesn't exists. Please sign up!")
            }

            req.existingUser = existingUser;
            next();
        }
    }
    catch(err){
        if(err.message === 'jwt expired'){
            res.status(404).json({"message" : "Session expired. Please Login!"});
        }
        else{
            res.status(400).json({
            "message" : err.message
        })
        }
    }
}


module.exports = {userAuth};