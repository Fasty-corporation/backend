const mongoose = require('mongoose');

// Importing models
const MainCategories = require('../models/mainCategories');
const Products = require('../models/products');
const SubCategories = require('../models/subCategories');
const ProductType = require('../models/productType');
const Cart = require('../models/cart');
const UserDetails = require('../models/userDetails');
const Address = require('../models/address');
const CreatedOffers = require('../models/createdOffers');
const GivenOffers = require('../models/givenOffers');
const OrderItem = require('../models/orderItem');
const Order = require('../models/order');

// Function to apply virtual relationships
module.exports = () => {
    // Helper function to enable virtuals for a schema
    const enableVirtuals = (schema) => {
        schema.set('toObject', { virtuals: true });
        schema.set('toJSON', { virtuals: true });
    };

    // Enable virtuals for all schemas
    [
        MainCategories.schema, 
        SubCategories.schema, 
        Products.schema, 
        ProductType.schema, 
        Cart.schema, 
        UserDetails.schema, 
        Address.schema, 
        CreatedOffers.schema, 
        GivenOffers.schema, 
        OrderItem.schema, 
        Order.schema
    ].forEach(enableVirtuals);

    // MainCategories ↔ SubCategories (One-to-Many)
    MainCategories.schema.virtual('subCategories', {
        ref: 'SubCategories',
        localField: '_id',
        foreignField: 'mainCategoryId'
    });

    SubCategories.schema.virtual('mainCategory', {
        ref: 'MainCategories',
        localField: 'mainCategoryId',
        foreignField: '_id',
        justOne: true
    });

    // MainCategories ↔ Products (One-to-Many)
    MainCategories.schema.virtual('products', {
        ref: 'Products',
        localField: '_id',
        foreignField: 'mainCategoryId'
    });

    Products.schema.virtual('mainCategory', {
        ref: 'MainCategories',
        localField: 'mainCategoryId',
        foreignField: '_id',
        justOne: true
    });

    // SubCategories ↔ Products (One-to-Many)
    SubCategories.schema.virtual('products', {
        ref: 'Products',
        localField: '_id',
        foreignField: 'subCategoryId'
    });

    Products.schema.virtual('subCategory', {
        ref: 'SubCategories',
        localField: 'subCategoryId',
        foreignField: '_id',
        justOne: true
    });

    // Products ↔ ProductType (One-to-Many)
    Products.schema.virtual('productTypes', {
        ref: 'ProductType',
        localField: '_id',
        foreignField: 'productId'
    });

    ProductType.schema.virtual('product', {
        ref: 'Products',
        localField: 'productId',
        foreignField: '_id',
        justOne: true
    });

    // UserDetails ↔ Cart (One-to-Many)
    UserDetails.schema.virtual('carts', {
        ref: 'Cart',
        localField: '_id',
        foreignField: 'userId'
    });

    Cart.schema.virtual('user', {
        ref: 'UserDetails',
        localField: 'userId',
        foreignField: '_id',
        justOne: true
    });

    // Cart ↔ ProductType (One-to-Many)
    ProductType.schema.virtual('carts', {
        ref: 'Cart',
        localField: '_id',
        foreignField: 'productTypeId'
    });

    Cart.schema.virtual('productType', {
        ref: 'ProductType',
        localField: 'productTypeId',
        foreignField: '_id',
        justOne: true
    });

    // UserDetails ↔ Address (One-to-Many)
    UserDetails.schema.virtual('addresses', {
        ref: 'Address',
        localField: '_id',
        foreignField: 'userId'
    });

    Address.schema.virtual('user', {
        ref: 'UserDetails',
        localField: 'userId',
        foreignField: '_id',
        justOne: true
    });

    // CreatedOffers ↔ GivenOffers (One-to-Many)
    CreatedOffers.schema.virtual('givenOffers', {
        ref: 'GivenOffers',
        localField: '_id',
        foreignField: 'createdOfferId'
    });

    GivenOffers.schema.virtual('createdOffer', {
        ref: 'CreatedOffers',
        localField: 'createdOfferId',
        foreignField: '_id',
        justOne: true
    });

    // UserDetails ↔ GivenOffers (One-to-Many)
    UserDetails.schema.virtual('givenOffers', {
        ref: 'GivenOffers',
        localField: '_id',
        foreignField: 'userId'
    });

    GivenOffers.schema.virtual('user', {
        ref: 'UserDetails',
        localField: 'userId',
        foreignField: '_id',
        justOne: true
    });

    // UserDetails ↔ Orders (One-to-Many)
    UserDetails.schema.virtual('orders', {
        ref: 'Order',
        localField: '_id',
        foreignField: 'userId'
    });

    Order.schema.virtual('user', {
        ref: 'UserDetails',
        localField: 'userId',
        foreignField: '_id',
        justOne: true
    });

    // UserDetails ↔ OrderItems (One-to-Many)
    UserDetails.schema.virtual('orderItems', {
        ref: 'OrderItem',
        localField: '_id',
        foreignField: 'userId'
    });

    OrderItem.schema.virtual('user', {
        ref: 'UserDetails',
        localField: 'userId',
        foreignField: '_id',
        justOne: true
    });

    // Order ↔ OrderItem (One-to-Many)
    Order.schema.virtual('orderItems', {
        ref: 'OrderItem',
        localField: '_id',
        foreignField: 'orderId'
    });

    OrderItem.schema.virtual('order', {
        ref: 'Order',
        localField: 'orderId',
        foreignField: '_id',
        justOne: true
    });
};
