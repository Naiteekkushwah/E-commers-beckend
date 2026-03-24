const models = require('../models/user-models');
const jwt = require('jsonwebtoken');
module.exports.userfounde = async (req, res, next) => {

    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await models.findById(decoded._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
req.user = user;

        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token.' });   
    }
};

