const sequelize = require('.')
const {DataTypes} = require('sequelize');

const UserProduct = sequelize.define('userProduct', {
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    itemId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    packId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    statusChangeDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    timeToCall: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    accCommission: {
        type: DataTypes.DECIMAL,
        allowNull: true
    },
    nextBillingDate: DataTypes.DATE,
    divisionDesc: DataTypes.TEXT
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = UserProduct;
