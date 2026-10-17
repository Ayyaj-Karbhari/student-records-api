const express = require("express")
const router = express.Router()
const {
    createCourse,
    getAllCourses,
    getCourseById,
    getCourseStudents,
    updateCourse,
    deleteCourse
} = require("../controllers/course.controller")

router.route("/")
    .post(createCourse)
    .get(getAllCourses)

router.route("/:id")
    .get(getCourseById)
    .put(updateCourse)
    .delete(deleteCourse)

router.route("/:id/students")
    .get(getCourseStudents)

module.exports = router