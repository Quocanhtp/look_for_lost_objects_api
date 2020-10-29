const User = require("../models/user.model.js");
const { handleSuccess, handleBadRequest } = require("../helpers/response.js");
const { generateAuthToken, generateRefreshToken } = require("../helpers/JWTHelper.js");
const { checkPassword } = require("../helpers/bcryptHelper.js");

// Create and Save a new User
exports.login = async (req, res) => {
    // Validate request
    try {
        const { phone_number, password } = req.body
        const { err, result } = await User.checkLogin('', phone_number, password)
        
        if (err || !result) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
        }

        if (!checkPassword(password, result.password)) {
            return res.status(401).send({ error: 'Login failed! Check authentication credentials' })
        }

        if (result.password) {
            delete result.password
        }

        const assessToken = await generateAuthToken(result)
        const refreshToken = await generateRefreshToken(result)
        return handleSuccess(res, 'Login success.', {
            result,
            assessToken,
            refreshToken
        })

    } catch (error) {
        handleBadRequest(res, '', error)
    }
};

exports.me = (req, res) => {
    return handleSuccess(res, '', req.user)
}