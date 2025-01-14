const sequelize = require('.')
const {DataTypes} = require('sequelize');

const Supplier = sequelize.define('supplier', {
    supplierId: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    supplierName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    titleDesc: DataTypes.STRING,
    productPictureName: DataTypes.STRING,
    pictureName: DataTypes.STRING,
    videoName: DataTypes.STRING,
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    isEnabled: DataTypes.SMALLINT,
    hp: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    cv: DataTypes.TEXT,
    cvDesc: DataTypes.TEXT
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = Supplier;
