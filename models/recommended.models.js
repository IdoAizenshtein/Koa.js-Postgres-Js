const sequelize = require('.')
const {DataTypes} = require('sequelize');

const Recommended = sequelize.define('recommended', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    priority: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    photo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recommendedName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recommendedTitle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recommendedText: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});


module.exports = Recommended;
