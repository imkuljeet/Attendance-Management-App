const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const userController = require('../controllers/user');

router.post('/markAttendance',userController.markAttendance);

router.get('/getAttendance',userController.getAttendance);

router.get('/fetchAttendanceReport',userController.fetchAttendance);

module.exports = router;