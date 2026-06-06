const jwt = require('jsonwebtoken');

function generateToken(user) {
  const payload = {
    id: user._id,
    name:user.fullName,
    email: user.email,
    role: user.role,
  };
  return jwt.sign(payload, process.env.JWT_SECRET);
}

 function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        console.error('Token verification error:', err);
        return null;
    }
}
module.exports = { generateToken, verifyToken };