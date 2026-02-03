const validator = require('validator');

const validateSignUpData = function (req) {
    const {firstName, lastName, age, emailId, password, gender, photoUrl} = req.body;

    if(!firstName || !lastName){
        throw new Error('Please enter the Name!');
    }

    if(!validator.isEmail(emailId)){
        throw new Error('Please enter a valid Email ID!');
    }

    if(!validator.isStrongPassword(password)){
        throw new Error('Please enter a Strong password!');
    }

    if(age && age<18){
        throw new Error('Minimum age limit is 18!');
    }

    if(gender && !["Male","Female","Others"].includes(gender)){
        throw new Error('Invalid gender type!')
    }

    if(!validator.isURL(photoUrl)){
        throw new Error('Please enter Photo URL!')
    }
    
}

module.exports = validateSignUpData;