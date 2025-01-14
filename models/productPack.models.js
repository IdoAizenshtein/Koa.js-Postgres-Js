const sequelize = require('.')
const {DataTypes} = require('sequelize');

const ProductPack = sequelize.define('productPack', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    itemId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    packName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    packPriority: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    isDeleted: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    packDetails: DataTypes.TEXT,
    packList: DataTypes.TEXT,
    packPrice: DataTypes.INTEGER,
    packPricePeriod: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    packCommitMonth: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    commissionPrc: DataTypes.DECIMAL
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = ProductPack;
