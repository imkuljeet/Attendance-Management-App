const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Student = sequelize.define('Student', {
    studentID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    studentName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Student;

