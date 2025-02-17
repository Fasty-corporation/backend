const { decodeToken, checkPassword } = require("../../functions/helperFunction")
const { findUserService } = require("../../services/userServices")


const authMiddleware = async (req, res, next) => {
    const { token } = req.headers
    try {
        if (!token) {
            throw new Error({ message: "LogIn Again " })
        }
        const decodeValues = decodeToken(token)
        if (!decodeValues) {
            throw new Error({ message: "LogIn Again " })
        }
        const { email, password } = decodeValues
        const findedUser = await findUserService(email)
        if (!findedUser) {
            throw new Error({ message: "LogIn Again " })
        }
        const checkPwd = await checkPassword(password, findedUser.password)
        if (!checkPwd) {
            throw new Error({ message: "LogIn Again " })
        }
        req.user = findedUser
        next()

    } catch (error) {
        res.status(400).send({ message: error })
    }
}



module.exports = authMiddleware