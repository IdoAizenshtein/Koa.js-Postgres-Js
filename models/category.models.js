const sequelize = require('.')
const {DataTypes} = require('sequelize');

const Category = sequelize.define('category', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    hebrewName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = Category;
