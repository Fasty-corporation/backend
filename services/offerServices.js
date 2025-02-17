const CreatedOffers = require('../models/createdOffers')
const GivenOffers = require('../models/givenOffers')
const UserDetails = require('../models/userDetails')
const offerServices = {

    // create offer service for create offer on createdOffers table
    createOfferService: async (offerName, minValue, discount) => {
        try {
            const dbRes = await CreatedOffers.create({ offerName, minValue, discount })
            return dbRes
        } catch (error) {
            throw error
        }
    },

    // get offer service for getting all the offers that are already created
    getCreatedOffersService: async () => {
        try {
            const dbres = await CreatedOffers.findAll()
            return dbres

        } catch (error) {
            throw error
        }
    },
    // get offer service for getting all the offers that are already created
    getGivenOffersService: async () => {
        try {
            const dbres = await GivenOffers.findAll({
                include: [
                    { model: UserDetails, attributes: ['email'] },
                    { model: CreatedOffers, attributes: ['offerName', 'minValue', 'discount'] }
                ]
            })
            return dbres

        } catch (error) {
            throw error
        }
    },

    // give offer service to give offer to a specific user 
    giveOfferService: async (createdofferId, userId) => {
        try {

            // checking if the offer is already given
            const getGivenOffer = await GivenOffers.findOne({ where: { createdofferId, userId } })
            if (getGivenOffer) {
                throw new Error("The offer is already given")
            }
            const getCreatedOffer = await CreatedOffers.findOne({ where: { id: createdofferId } })
            if (Number(getCreatedOffer.id) === Number(createdofferId)) {

                const givenOfferRes = await GivenOffers.create({ createdofferId, userId })
                return { getCreatedOffer, givenOfferRes }
            }
            else {
                throw new Error("Can't find the offer while giving offer")
            }

        } catch (error) {
            throw error
        }
    },

    // get user offers service tp fetch user offer by therir id
    getUserOffersService: async (id) => {
        try {
            const dbRes = await GivenOffers.findAll({
                where: { userId: id }, include: [
                    { model: CreatedOffers }
                ]
            })
            return dbRes
        } catch (error) {
            throw error
        }
    },

    // find offer by id service to find the offer using id
    findOfferbyId: async (id) => {
        try {
            const dbRes = await CreatedOffers.findOne({ where: { id: id } })
            return dbRes

        } catch (error) {
            throw error
        }
    },

    // delete offer by id service to delete the offer using id
    deleteGivenOfferService: async (createdofferId, transaction) => {
        const options = { where: { createdofferId } };
        if (transaction) {
            options.transaction = transaction;
        }

        try {
            const dbRes = await GivenOffers.destroy(options)
            return dbRes

        } catch (error) {
            throw error
        }
    }

}

module.exports = offerServices