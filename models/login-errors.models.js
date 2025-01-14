const sequelize = require('.')
const {DataTypes} = require('sequelize');

const LoginErrors = sequelize.define('login-errors', {
    mobile: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    number_of_attempts: {
        type: DataTypes.BIGINT
    },
    ip: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true
});

module.exports = LoginErrors;
