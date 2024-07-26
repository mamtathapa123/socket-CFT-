const jwt = require("jsonwebtoken");

//verify token with jwt
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ message: "Invalid token!" });
  }
  if (authHeader && authHeader.length) {
    const token = authHeader.split(" ")[1];
  }
  jwt.verify(token, process.env.SECRECT_KEY, (err, user) => {
    if (err) {
      res.status(401).json({ message: "Invalid token!" });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
