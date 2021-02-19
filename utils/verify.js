 
const jwt = require("jsonwebtoken");
require("dotenv").config();
 function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      req.token = bearerToken;
      jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, authData) => {
        if (err) {
          res.status(403).json({message:"Ne može se pristupiti"});
        } else {
          req.authData=authData;
        }
      });
      next();
    } else {
      res.status(403).json({message:"Ne može se pristupiti"});
    }
  }
  module.exports= verifyToken;