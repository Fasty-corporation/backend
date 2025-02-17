const { checkAdminPassword, generateToken, decodeToken } = require("../../functions/helperFunction")

const adminAuthController = {
    adminLogIn: async (req, res) => {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).send({ message: "some fields are blank while login" })
        }
        const checkPwd = checkAdminPassword(email, password)
        if (!checkPwd) {
            return res.status(500).send({ message: "Wrong Password" })
        }
        const token = generateToken(email, password)
        return res.send({ token: token, email, success: true })
    },

    verifyAdmin: async (req, res) => {
        const { token } = req.body
        if (!token) {
            return res.status(500).send({ message: 'Login again' })
        }
        const { email, password } = decodeToken(token)
        const checkPwd = checkAdminPassword(email, password)
        if (!checkPwd) {
            return res.status(500).send({ message: 'Login again' })
        }

        res.send({ token: token, email, success: true })

    }
}

module.exports = adminAuthController