const { decodeToken, checkAdminPassword } = require("../../functions/helperFunction")

const adminAuthMiddleware = (req, res, next) => {
    const { token } = req.headers
    // if token not present
    if (!token) {
        return res.status(500).send({ message: "token not found" })
    }
    const decodedVal = decodeToken(token)
    // if email or password is null
    if (!decodedVal) {
        return res.status(500).send({ message: "token not found (Login again)" })
    }
    const { email, password } = decodedVal
    const checkPassword = checkAdminPassword(email, password)

    if (checkPassword) {
        next()
    }
    else {
        return res.status(500).send({ message: "Invalid Token !" })
    }

}


module.exports = adminAuthMiddleware