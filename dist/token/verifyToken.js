"use strict";
const jwt = require("jsonwebtoken");
//THE TOKEN WILL BE SAVE IN HEADERS AS --- "token" ---
//TOKEN WITH NO OTHERS AUTHORIZATION
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_KEY, (err, user) => {
            if (err)
                res.status(403).json("Token is not valid!");
            req.user = user;
            next();
        });
    }
    else {
        return res.status(401).json("You are not authenticated");
    }
};
//TOKEN WITH STANDARD LOGIN AUTHORIZATION (NOT DONE YET)
const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id || req.user.role == "ADMIN") {
            next();
        }
        else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
//TOKEN WITH ADMIN LOGIN AUTHORIZATION
const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role == "ADMIN") {
            next();
        }
        else {
            res.status(403).json("You are not alowed to do that!");
        }
    });
};
module.exports = { verifyTokenAndAdmin, verifyToken, verifyTokenAndAuthorization };
//# sourceMappingURL=verifyToken.js.map