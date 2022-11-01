const jwt = require("jsonwebtoken");

//THE TOKEN WILL BE SAVE IN HEADERS AS --- "token" ---

//TOKEN WITH NO OTHERS AUTHORIZATION

const verifyToken = (req:any, res:any, next:any) => {
  const authHeader = req.headers.token;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_KEY, (err:any, user:any) => {
      if(err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated");
  }
};

//TOKEN WITH STANDARD LOGIN AUTHORIZATION (NOT DONE YET)
const verifyTokenAndAuthorization = (req:any, res:any, next:any) => {
  verifyToken(req, res, () => {
    if (req.user.id || req.user.role == "ADMIN") {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

//TOKEN WITH ADMIN LOGIN AUTHORIZATION
const verifyTokenAndAdmin = (req:any, res:any, next:any) => {
  verifyToken(req, res, () => {
    if (req.user.role == "ADMIN") {
      next();
    } else {
      res.status(403).json("You are not alowed to do that!");
    }
  });
};

module.exports = { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization };
