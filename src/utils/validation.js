const validator = require('validator');

const validateSignUpData = function (req) {
    const { firstName, lastName, age, emailId, password, gender, photoUrl, skills } = req.body;

    if (!firstName || !lastName) {
        throw new Error('Please enter the Name!');
    }

    if (!emailId) {
        throw new Error('Please enter the email ID!');
    }

    if (!validator.isEmail(emailId)) {
        throw new Error('Please enter a valid Email ID!');
    }

    if (!password) {
        throw new Error('Please enter the password!');
    }

    if (!validator.isStrongPassword(password)) {
        throw new Error('Please enter a Strong password!');
    }

    if (age && age < 18) {
        throw new Error('Minimum age limit is 18!');
    }

    if (age && age > 60) {
        throw new Error('Maximum age limit is 60');
    }

    if (gender && !["Male", "Female", "Others"].includes(gender)) {
        throw new Error('Invalid gender type!')
    }

    if (photoUrl && !validator.isURL(photoUrl)) {

        throw new Error('Please enter valid Photo URL!')
    }

}

const validateUpdateData = function (req) {
    const allowedEditFields = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl"];
    const { firstName, lastName, age, gender, photoUrl } = req.body;

    const isAllowedUpdate = Object.keys(req.body).every((key) => allowedEditFields.includes(key));

    if (!isAllowedUpdate) {
        throw new Error("Updates not allowed for mentioned fields!");
    }

    if (firstName !== undefined && firstName.trim().length == 0 ||
        lastName !== undefined && lastName.trim().length == 0)
    {
        throw new Error("Please enter the name.");
    }

        if (age && age < 18) {
            throw new Error('Minimum age limit is 18!');
        }

    if (age && age > 60) {
        throw new Error('Maximum age limit is 60');
    }

    if (gender && !["Male", "Female", "Others"].includes(gender)) {
        throw new Error('Invalid gender type!')
    }

    if (photoUrl && !validator.isURL(photoUrl)) {

        throw new Error('Please enter valid Photo URL!')
    }

    return isAllowedUpdate;

}



module.exports = { validateSignUpData, validateUpdateData };