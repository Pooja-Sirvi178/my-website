const jwt = require('jsonwebtoken')

const protect = (req, res, next)  => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({error : 'No token provided.'});
    }

    const token = authHeader.split(' ')[1]; //"Bearer <token>" → just the token part

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; //attach user info to the request for later use
        next(); //token valid - let the request continue to the actual route
    } catch(err) {
        return res.status(401).json({err : 'Invalid or expired token.'});
    }
};

module.exports = protect;
