const {Sequelize} = require('sequelize');
const sequelize = require('../config/conexao');

const {DataTypes} = Sequelize;

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
    }
});

module.exports = User;