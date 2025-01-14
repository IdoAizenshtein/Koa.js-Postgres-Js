const sequelize = require('.')
const {DataTypes} = require('sequelize');

const AccountantSupplier = sequelize.define('accountantSupplier', {
    supplierId: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        allowNull: false
    },
    subDomainName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    itemId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    videoName: DataTypes.STRING
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = AccountantSupplier;
