const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret');
        req.user = { id: decoded.userId }; // Ensure this is correctly set to match the userId in your JWT
        next();
    } catch (err) {
        console.error('Invalid token:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
