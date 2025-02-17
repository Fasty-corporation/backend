const { getUserOffersService } = require("../../services/offerServices");

const userOfferController = {
    getOffers: async (req, res) => {
        const { id } = req.user
        try {
            if (!id) {
                throw new Error("error while fething offers")
            }
            const userOffer = await getUserOffersService(id)
            res.send(userOffer)

        } catch (error) {
            // Extract error message from the caught error object
            const errorMessage = error.message || 'error while fetching offer';
            res.status(500).send({ message: errorMessage })
        }
    }
}

module.exports = userOfferController