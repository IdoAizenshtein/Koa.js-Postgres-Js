const {Sequelize, DataTypes} = require('sequelize');
require('dotenv').config();

let {PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID} = process.env;
// console.log(PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID)
const sequelize = new Sequelize(PGDATABASE, PGUSER, PGPASSWORD, {
    dialect: 'postgres',
    ssl: true,
    host: PGHOST,
    logging: false,
    // logging: (...msg) => console.log(msg),
    dialectOptions: {
        project: ENDPOINT_ID,
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 20000
    }
});

try {
    sequelize.authenticate().then(r => {
        console.log("Connection has been established successfully.");
        // sequelize.sync({force: true}).then(r =>{
        //     console.log("Connection has sync");
        // });
        // sequelize.getQueryInterface().changeColumn("product", "supplierId", {
        //     type: DataTypes.BIGINT
        // });
    });
} catch (err) {
    console.error("Unable to connect to the database:", err);
}
module.exports = sequelize;
