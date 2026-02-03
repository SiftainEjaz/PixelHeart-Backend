const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minLength : 2,
        maxLength : 50,
        trim : true
    },
    lastName : {
        type : String
    },
    age : {
        type : Number,
        validate(value){
            if(value<18){
                throw new Error("Minimum age should be 18!")
            }
        }
    },
    emailId : {
        type : String,
        lowercase : true,
        required : true,
        unique : true,
        trim : true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email ID: " +value + ". " + "Please try again!");
            }
        }
    },
    password : {
        type : String,
        required : true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Please enter a Strong Password!");
            }
        }
    },
    gender : {
        type : String,
        validate(value){
            if(!["Male","Female","Others"].includes(value)){
                throw new Error("Invalid gender type!")
            }
        }
    },
    about : {
        type : String,
        default : 'This is a default about of the user.',
    },
    skills : {
        type : [String]
    },
    photoUrl : {
        type : String,
        default : 'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-portrait-176256935.jpg',
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo URL. Please try again!")
            }
        }
    }
},
{
    timestamps : true
})

const User = mongoose.model("User" , userSchema);

module.exports = User;

