const sequelize = require('.')
const {DataTypes} = require('sequelize');

const Product = sequelize.define('product', {
    itemId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    itemName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isEnabled: DataTypes.SMALLINT,
    categoryId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    priority: {
        type: DataTypes.SMALLINT,
        allowNull: false
    },
    supplierId: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    videoName: DataTypes.STRING,
    pageSubTitle: DataTypes.STRING,
    pageSummary: DataTypes.STRING,
    pageAction: DataTypes.STRING,
    pageSqureTitle1: DataTypes.STRING,
    pageSqureDet1: DataTypes.STRING,
    pageSqureIcon1: DataTypes.STRING,
    pageSqureTitle2: DataTypes.STRING,
    pageSqureDet2: DataTypes.STRING,
    pageSqureIcon2: DataTypes.STRING,
    pageSqureTitle3: DataTypes.STRING,
    pageSqureDet3: DataTypes.STRING,
    pageSqureIcon3: DataTypes.STRING
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = Product;
