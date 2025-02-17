// Importing models
const MainCategories = require('../models/mainCategories')
const Products = require('../models/products')
const SubCategories = require('../models/subCategories')
const ProductType = require('../models/productType')
const Cart = require('../models/cart')
const UserDetails = require('../models/userDetails')
const Address = require('../models/address')
const CreatedOffers = require('../models/createdOffers')
const GivenOffers = require('../models/givenOffers')
const OrderItem = require('../models/orderItem')
const Order = require('../models/order')


// all association
module.exports = () => {

    // relation between main categories & subcategories
    MainCategories.hasMany(SubCategories);
    SubCategories.belongsTo(MainCategories);

    // relation between product & main categories
    MainCategories.hasMany(Products);
    Products.belongsTo(MainCategories);

    // relation between subcategories & product
    SubCategories.hasMany(Products);
    Products.belongsTo(SubCategories);

    // relation between product & producttypes
    Products.hasMany(ProductType);
    ProductType.belongsTo(Products);

    // relation between userdetails and cart
    UserDetails.hasMany(Cart)
    Cart.belongsTo(UserDetails)

    // relation between cart & product types
    ProductType.hasMany(Cart)
    Cart.belongsTo(ProductType)

    // relation between address & user
    UserDetails.hasMany(Address)
    Address.belongsTo(UserDetails)

    // relation between created offer & given offer
    CreatedOffers.hasMany(GivenOffers)
    GivenOffers.belongsTo(CreatedOffers)

    // relation between given offer & user
    UserDetails.hasMany(GivenOffers)
    GivenOffers.belongsTo(UserDetails)

    // relation between order & user 
    UserDetails.hasMany(Order)
    Order.belongsTo(UserDetails)

    // relation between order item & user
    UserDetails.hasMany(OrderItem)
    OrderItem.belongsTo(UserDetails)

    // relation between order & order Item
    Order.hasMany(OrderItem)
    OrderItem.belongsTo(Order)


}