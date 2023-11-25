const express = require('express');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const sequelize = new Sequelize('node-complete', 'root', 'amway123', {
    dialect: 'mysql',
    host: 'localhost'
});

const Student = sequelize.define('Student', {
    studentID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    studentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});


const Attendance = sequelize.define('Attendance', {
    attendanceID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    attendanceDate: {
        type: DataTypes.DATEONLY, 
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('present', 'absent'),
        allowNull: false,
    },
});

Student.hasMany(Attendance, { foreignKey: 'StudentId' });
Attendance.belongsTo(Student, { foreignKey: 'StudentId' });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'path-to-your-html-file.html'));
});

app.post('/user/markAttendance', async (req, res) => {
    try {
        const { date, attendanceData } = req.body;

        for (const { studentName, status } of attendanceData) {
            const [student, created] = await Student.findOrCreate({
                where: { studentName },
            });

            await Attendance.create({
                attendanceDate: date,
                status,
                StudentId: student.studentID,
            });
        }

        res.json({ message: 'Attendance marked successfully!' });
    } catch (error) {
        console.error('Error marking attendance:', error);
        res.status(500).json({ error: 'Error marking attendance' });
    }
});

app.get('/user/getAttendance', async (req, res) => {
    try {
        const { date } = req.query;

        const attendanceData = await Attendance.findAll({
            where: { attendanceDate: date },
            include: [{ model: Student, attributes: ['studentID', 'studentName'] }],
            attributes: ['status'],
        });

        console.log('Fetched attendance data:', attendanceData);

        res.json(attendanceData);
    } catch (error) {
        console.error('Error fetching attendance records:', error);
        res.status(500).json({ error: 'Error fetching attendance records' });
    }
});


app.get('/user/fetchAttendanceReport', async (req, res) => {
    try {
        const attendanceReport = await calculateAttendanceReport();

        res.json(attendanceReport);
    } catch (error) {
        console.error('Error fetching attendance report:', error);
        res.status(500).json({ error: 'Error fetching attendance report' });
    }
});


async function calculateAttendanceReport() {
    
    const attendanceRecords = await Attendance.findAll({
        include: [{ model: Student, attributes: ['studentID', 'studentName'] }],
        attributes: ['status'],
    });

    const attendanceReport = {};

    attendanceRecords.forEach((record) => {
        const { studentID, studentName } = record.Student;
        const status = record.status;

        if (!attendanceReport[studentID]) {
            attendanceReport[studentID] = {
                studentName,
                totalDays: 0,
                presentDays: 0,
            };
        }

        attendanceReport[studentID].totalDays += 1;

        if (status === 'present') {
            attendanceReport[studentID].presentDays += 1;
        }
    });

    return attendanceReport;
}

sequelize
  .sync()
  .then(result => {
    // console.log(result);
    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });
