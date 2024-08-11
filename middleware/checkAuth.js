const SECRET_KEY = 'USERAPI';
const jwt = require("jsonwebtoken");
module.exports = {
    checkAuth: (req, res, next) => {
    let token = req.get("authorization");
    if (token) {
        // Remove Bearer from string
        token = token.slice(7);
        console.log(token);
        console.log(process.env.JWT_KEY);
        jwt.verify(token,"USERAPI", (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,  
            message: "Invalid Token..."
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};