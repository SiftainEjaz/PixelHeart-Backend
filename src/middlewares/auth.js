const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const userAuth = async (req,res,next)=>{
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Please Login!");
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
        res.status(400).json({
            "message" : err.message
        })
    }
}

module.exports = {userAuth};