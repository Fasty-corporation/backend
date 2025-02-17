const { getUsersService } = require('../../services/userServices')


const userController = {

    // getAllUsers function to get all the user from db
    getAllUsers: async (req, res) => {
        try {
            const users = await getUsersService()
            res.send(users)
        } catch (error) {
            res.status(500).send({ message: "error while fetching users", error })
        }
    }

}

module.exports = userController