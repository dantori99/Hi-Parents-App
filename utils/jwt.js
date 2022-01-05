const jwt = require('jsonwebtoken');

const createToken = payload => {
    try {
        const token = jwt.sign(payload, process.env.secret);
        return token;
    } catch (error) {
        console.log(error, '<<<<<< CREATE TOKEN JWT');
    }
}

const verifyToken = token => {
    try {
        const verify = jwt.verify(token, process.env.secret);
        return verify;
    } catch (error) {
        console.log(error, '<<<<< VERIFY TOKEN JWT');
    }
}

module.exports = {
    createToken,
    verifyToken
}