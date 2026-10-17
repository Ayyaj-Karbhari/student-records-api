const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Course name is required"],
        trim: true
    },
    code: {
        type: String,
        required: [true, "Course code is required"],
        unique: true,
        trim: true
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Course", courseSchema);