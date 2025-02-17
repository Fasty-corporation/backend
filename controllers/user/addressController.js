const { createAddressService, findUserAddressService } = require('../../services/addressServices')

const addressController = {
    addAddress: async (req, res) => {
        const { id } = req.user
        if (!id || !req.body) {
            return res.status(400).send({ message: 'error while adding address' })
        }
        const jsonAddress = JSON.stringify(req.body)
        try {

            const dbRes = await createAddressService(jsonAddress, id)
            const formattedRes = { id: dbRes.id, address: JSON.parse(dbRes.address) }
            return res.send(formattedRes)

        } catch (error) {
            res.status(400).send({ message: 'error while adding address' })
        }
    },
    getAddresses: async (req, res) => {
        const { id } = req.user
        if (!id) { return res.status(500).send({ message: 'error while fetching the addresses' }) }
        try {
            const dbRes = await findUserAddressService(id)
            dbRes.forEach((values) => {
                values.address = JSON.parse(values.address)
            })
            return res.send(dbRes)
        } catch (error) {
            res.status(500).send({ message: 'error while fetching the addresses' })
        }
    }
}


module.exports = addressController