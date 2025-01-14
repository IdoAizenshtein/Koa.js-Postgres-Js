const sequelize = require('.')
const {DataTypes} = require('sequelize');

const Accountants = sequelize.define('accountants', {
    mobile: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        allowNull: false
    },
    subDomainName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    mainPicture: DataTypes.STRING,
    signaturePicture: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    bankNumber: DataTypes.INTEGER,
    snifNumber: DataTypes.INTEGER,
    accountNumber: DataTypes.INTEGER,
    logoName: DataTypes.STRING
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

module.exports = Accountants;
