const { verifyToken } = require('../services/user');


const auth = async (req, res, next) => {
    const cookieHeader = req.headers['cookie'];
    let token;
        if (cookieHeader) {
        const match = cookieHeader.match(/jwttoken=([^;]+)/);
        token = match ? match[1] : null;
        }
        // console.log('Token from cookie:', token);
    if (!token) return res.status(401).send('Unauthorized: Token not found');

    const result = verifyToken(token);

    if (result) {
        req.user = result;
        return next();
    }
    return res.status(401).send('Unauthorized: Invalid token');
};

module.exports = {
    auth
};
