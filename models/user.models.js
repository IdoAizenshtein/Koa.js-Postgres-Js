const sequelize = require('.')
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true
    },
    mobile: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    subDomainLink: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail: DataTypes.STRING,
    otpCode: DataTypes.STRING,
    otpCodeTemp: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    mainPicture: DataTypes.STRING,
    followDate: DataTypes.DATE,
    lastWebsiteLogin: DataTypes.DATE,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    instagramId: DataTypes.STRING,
    userType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    companyHP: DataTypes.INTEGER,
    companyName: DataTypes.STRING,
    nextBillingDate: DataTypes.DATE
}, {
    freezeTableName: true,
    timestamps: false
});

// (async () => {
//     await sequelize.sync({ force: true });
//     // Code here
// })();

// Accountants.sync().then(r => {
//     console.log('r:', r)
// });

module.exports = User;
