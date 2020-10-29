const { verifyToken } = require('../helpers/JWTHelper');
const User = require('../models/user.model')


const getTokenFromHeader = req => {
    /**
     * @TODO Edge and Internet Explorer do some weird things with the headers
     * So I believe that this should handle more 'edge' cases ;)
     */
    if (
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
        (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    ) {
        return req.headers.authorization.split(' ')[1];
    }
    return null;
};

const isAuth = async (req, res, next) => {
    try {
        const token = getTokenFromHeader(req)
        const data = verifyToken(token)
        const { err, result } = await User.checkLogin(data.id, data.phone_number, '')

        if (err || !result) {
            res.status(401).send({ error: err || 'Not authorized to access this resource' })
        }

        if (result?.password) {
            delete result.password
        }
        req.user = result
        req.token = token
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
}
module.exports = {
    isAuth,
    getTokenFromHeader
}