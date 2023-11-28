const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
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

    res.json({ message: "Attendance marked successfully!" });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ error: "Error marking attendance" });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const { date } = req.query;

    const attendanceData = await Attendance.findAll({
      where: { attendanceDate: date },
      include: [{ model: Student, attributes: ["studentID", "studentName"] }],
      attributes: ["status"],
    });

    res.json(attendanceData);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    res.status(500).json({ error: "Error fetching attendance records" });
  }
};

exports.fetchAttendance = async (req, res) => {
  try {
    const attendanceReport = await calculateAttendanceReport();

    res.json(attendanceReport);
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    res.status(500).json({ error: "Error fetching attendance report" });
  }
};

async function calculateAttendanceReport() {
  const attendanceRecords = await Attendance.findAll({
    include: [{ model: Student, attributes: ["studentID", "studentName"] }],
    attributes: ["status"],
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

    if (status === "present") {
      attendanceReport[studentID].presentDays += 1;
    }
  });

  return attendanceReport;
}
