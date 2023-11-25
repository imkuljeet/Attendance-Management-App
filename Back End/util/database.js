const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'amway123', {
  dialect: 'mysql',
  host: 'localhost'
});

module.exports = sequelize;
