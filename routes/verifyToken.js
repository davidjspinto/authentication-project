const res = require("express/lib/response");
const jwt = require("jsonwebtoken");

//validate if user is logged

module.exports = function (req, res, next) {
    const token = req.header("auth-token");
    if(!token) return res.status(401).send("Access Denied");
    try{
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
}