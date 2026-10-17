const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message = err.message || "Internal Server Error"

    // Mongoose bad ObjectId (CastError)
    if (err.name === "CastError") {
        statusCode = 400
        message = `Invalid ${err.path}: ${err.value}`
    }

    // Mongoose Validation Error
    if (err.name === "ValidationError") {
        statusCode = 400
        message = Object.values(err.errors).map(val => val.message).join(", ")
    }

    // Mongoose Duplicate Key Error
    if (err.code && err.code === 11000) {
        statusCode = 409
        const field = Object.keys(err.keyValue)[0]
        message = `Duplicate value entered for ${field} field. Please use another value.`
    }

    return res.status(statusCode).json({
        success: false,
        message: message
    })
}

module.exports = errorHandler