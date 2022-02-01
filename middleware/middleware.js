const jwt = require("jsonwebtoken");
const config = require('./../config');

async function checkToken(req,res,next){
    let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

    if(token){
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        jwt.verify(token, config.secretString, (err, decoded) => {
            if (err) {                
                return res.json({statusCode:0, message:'Token is not valid or expired', todo:'Please login before continue!'});
            } else {
                req.decoded=decoded;
                next();
            }
        });
     
    }
    else return res.send({statusCode:0, message:'Auth token is not supplied', todo:'Please login before continue!'});
}

module.exports = {
    checkToken
}