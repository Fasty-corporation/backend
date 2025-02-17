const { createOfferService, getCreatedOffersService, getGivenOffersService, giveOfferService } = require("../../services/offerServices")
const { findUserByEmailService } = require("../../services/userServices")

const offerController = {
    createOffer: async (req, res) => {
        const { offerName, minimumValue, discount } = req.body
        try {
            if (!offerName || !minimumValue || !discount) {
                return res.status(500).send({ message: "error while creating offer" })
            }

            const dbRes = await createOfferService(offerName, minimumValue, discount)
            return res.send(dbRes)


        } catch (error) {
            res.status(500).send({ message: "error while creating offer", error })
        }
    },

    getCreatedOffers: async (req, res) => {
        try {
            const createdOffers = await getCreatedOffersService()
            return res.send(createdOffers)

        } catch (error) {
            res.status(500).send({ message: "error while fetching offers", error })
        }
    },

    getGivenOffers: async (req, res) => {
        try {
            const givenOffers = await getGivenOffersService()
            return res.send(givenOffers)

        } catch (error) {
            res.status(500).send({ message: "error while fetching offers", error })
        }
    },

    giveOffer: async (req, res) => {
        const { offerId, userEmail } = req.body

        if (!offerId || !userEmail) {
            return res.status(500).send({ message: "error while giving offer(some fields are mising) " })
        }

        try {
            const findedUser = await findUserByEmailService(userEmail)
            const giveOffer = await giveOfferService(offerId, findedUser.id)

            const givenOfferDetails = {
                id: giveOffer.givenOfferRes.id,
                user: { email: userEmail },
                createdoffer: {
                    offerName: giveOffer.getCreatedOffer.offerName,
                    discount: giveOffer.getCreatedOffer.discount,
                    minValue: giveOffer.getCreatedOffer.minValue,
                }
            }
            return res.send(givenOfferDetails)

        } catch (error) {
            // Extract error message from the caught error object
            const errorMessage = error.message || 'error while giving offer';
            res.status(500).send({ message: errorMessage })
        }



    }


}


module.exports = offerController