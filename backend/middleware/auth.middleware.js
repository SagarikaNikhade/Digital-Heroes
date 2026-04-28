const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token){
   return res.status(401).json({ message: "No token found!" });
  }

  const decoded = jwt.verify(token, "secret");

  req.user = decoded;
  next();
};

module.exports = { authMiddleware }