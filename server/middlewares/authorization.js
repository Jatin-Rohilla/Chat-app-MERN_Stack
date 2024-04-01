require("dotenv").config();
const jwt = require("jsonwebtoken");

const authorization = (arr) => {
  return (req, res, next) => {
    // if (!req.cookies.token) {
    //   return res.json({ message: "Please login first" });
    // }
    if (!req.headers.authorization) {
      return res.json({ message: "Please login first" });
    }

    // const token = req.cookies?.token;
    const token = req.headers.authorization.split("Bearer")[1];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        console.log(err);
        return res.json({ message: "Please login first" });
      }

      const role = decoded.role;

      if (arr.includes(role)) {
        req.userId = decoded.userId;
        return next();
      }

      return res.status(401).json({ message: "Not Authorized" });
    });
  };
};

module.exports = { authorization };
