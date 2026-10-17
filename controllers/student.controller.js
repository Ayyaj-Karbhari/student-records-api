const Student = require("../models/student.model")
const Course = require("../models/course.model")

// Create a Student
const createStudent = async (req, res, next) => {
    try {
        const { name, email, rollNumber, course, marks } = req.body

        if (!name || !email || !rollNumber || !course || marks === undefined) {
            return res.status(400).json({
                success: false,
                message: "All required student fields must be provided"
            })
        }

        // Verify if the course exists
        const existingCourse = await Course.findById(course)
        if (!existingCourse) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            })
        }

        const student = await Student.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            rollNumber: rollNumber.trim().toUpperCase(),
            course,
            marks,
            enrolledDate: req.body.enrolledDate || Date.now()
        })

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        })
    } catch (err) {
        next(err)
    }
}

// Get All Students (with search and filter, course details populated)
const getAllStudents = async (req, res, next) => {
    try {
        const { search, course } = req.query
        let query = {}

        if (search) {
            query.name = { $regex: search, $options: "i" }
        }

        if (course) {
            query.course = course
        }

        const students = await Student.find(query).populate("course").sort({ createdAt: -1 })

        return res.status(200).json({
            success: true,
            count: students.length,
            data: students
        })
    } catch (err) {
        next(err)
    }
}

// Get Single Student
const getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id).populate("course")

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: student
        })
    } catch (err) {
        next(err)
    }
}

// Update Student
const updateStudent = async (req, res, next) => {
    try {
        const { course } = req.body

        if (course) {
            const existingCourse = await Course.findById(course)
            if (!existingCourse) {
                return res.status(404).json({
                    success: false,
                    message: "Course not found"
                })
            }
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate("course")

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student
        })
    } catch (err) {
        next(err)
    }
}

// Delete Student
const deleteStudent = async (req, res, next) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id)

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        })
    } catch (err) {
        next(err)
    }
}

// Get Statistics (average marks and student count per course)
const getStudentStats = async (req, res, next) => {
    try {
        const stats = await Student.aggregate([
            {
                $group: {
                    _id: "$course",
                    studentCount: { $sum: 1 },
                    averageMarks: { $avg: "$marks" }
                }
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "_id",
                    foreignField: "_id",
                    as: "courseDetails"
                }
            },
            {
                $unwind: "$courseDetails"
            },
            {
                $project: {
                    _id: 0,
                    courseId: "$_id",
                    courseName: "$courseDetails.name",
                    courseCode: "$courseDetails.code",
                    studentCount: 1,
                    averageMarks: { $round: ["$averageMarks", 2] }
                }
            }
        ])

        return res.status(200).json({
            success: true,
            count: stats.length,
            data: stats
        })
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    updateStudent,
    deleteStudent,
    getStudentStats
}