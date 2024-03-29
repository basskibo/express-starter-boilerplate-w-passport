const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;

    console.log("Authorization = " , req.headers);
    console.log("USer = " , req.user);
    if(authorization && authorization.split(' ')[0] === 'Token') {
        return authorization.split(' ')[1];
    }
    return null;
};

const auth = {
    required: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
    }),
    optional: jwt({
        secret: 'secret',
        userProperty: 'payload',
        getToken: getTokenFromHeaders,
        credentialsRequired: false,
    }),
};

module.exports = auth;
