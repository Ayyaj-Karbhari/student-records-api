const Course = require("../models/course.model")
const Student = require("../models/student.model")

// Create a Course
const createCourse = async (req, res, next) => {
    try {
        const { name, code, duration } = req.body

        if (!name || !code || !duration) {
            return res.status(400).json({
                success: false,
                message: "Course name, code, and duration are required"
            })
        }

        const course = await Course.create({
            name: name.trim(),
            code: code.trim(),
            duration
        })

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            data: course
        })
    } catch (err) {
        next(err)
    }
}

// Get All Courses
const getAllCourses = async (req, res, next) => {
    try {
        const courses = await Course.find().sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } catch (err) {
        next(err)
    }
}

// Get Single Course
const getCourseById = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: course
        })
    } catch (err) {
        next(err)
    }
}

// Get Students of a Course
const getCourseStudents = async (req, res, next) => {
    try {
        const courseId = req.params.id

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        const students = await Student.find({ course: courseId }).populate("course")

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students
        })
    } catch (err) {
        next(err)
    }
}

// Update Course
const updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: course
        })
    } catch (err) {
        next(err)
    }
}

// Delete Course (not allowed while students are enrolled)
const deleteCourse = async (req, res, next) => {
    try {
        const courseId = req.params.id

        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        // Check if any students are enrolled in this course
        const studentCount = await Student.countDocuments({ course: courseId })
        if (studentCount > 0) {
            return res.status(409).json({
                success: false,
                message: "Cannot delete course while students are enrolled in it"
            })
        }

        await Course.findByIdAndDelete(courseId)

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createCourse,
    getAllCourses,
    getCourseById,
    getCourseStudents,
    updateCourse,
    deleteCourse
}