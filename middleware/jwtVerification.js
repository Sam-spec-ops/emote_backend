const jwt = require('jsonwebtoken');

const jwtverify = (req, res, next) => {
  const SECRET_KEY = 'process.env.SECRET_KEY';
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ auth: false, message: 'No token provided.' });
  }

  // Ensure the token is in the format: Bearer <token>
  const token =authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('Token verification error:', err); // Debugging info
      return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = jwtverify;
