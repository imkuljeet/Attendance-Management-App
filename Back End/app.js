const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const path = require('path');
const sequelize = require('./util/database');
const Student = require('./models/Student');
const Attendance = require('./models/Attendance');

const userRoutes = require('./routes/user');

const app = express();
app.use(cors());
app.use(bodyParser.json());


Student.hasMany(Attendance, { foreignKey: 'StudentId' });
Attendance.belongsTo(Student, { foreignKey: 'StudentId' });

app.use('/user',userRoutes);

sequelize
  .sync()
  .then(result => {
    
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
