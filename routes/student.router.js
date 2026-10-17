const express = require("express")
const router = express.Router()
const {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentStats
} = require("../controllers/student.controller")

// IMPORTANT: Define /stats before /:id so Express doesn't mistake "stats" for an ID
router.route("/stats")
    .get(getStudentStats)

router.route("/")
    .post(createStudent)
    .get(getAllStudents)

router.route("/:id")
    .get(getStudentById)
    .put(updateStudent)
    .delete(deleteStudent)

module.exports = router