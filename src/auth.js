const adminAuth = (req,res,next) => {
    const token = 'xyz';
    const isAuthorized = token === 'xyz';

    if(!isAuthorized)
    {
        res.status(401).json({"message" : "Authorization Failed"})
    }
    next();
}

module.exports = {adminAuth};