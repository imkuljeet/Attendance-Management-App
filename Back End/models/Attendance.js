const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Attendance = sequelize.define('Attendance', {
    attendanceID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    attendanceDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    status: {
        type: Sequelize.ENUM('present', 'absent'),
        allowNull: false,
    },
});

module.exports = Attendance;
