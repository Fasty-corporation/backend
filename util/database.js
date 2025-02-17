const { Sequelize } = require('sequelize')
const pg = require('pg')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PWD, {
    dialect: process.env.DIALECT,
    host: process.env.DB_HOST,
    logging: false,
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
})




module.exports = sequelize