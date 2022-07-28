const mongoose = require("mongoose")

// Schemas for unification of documents inside database
const courseSchema = new mongoose.Schema({    
    name: {
        type: String,
        unique: true,
    },
    type: String,
    img_url: String,
    price: Number,
    length_in_hours: Number,
    description: String,
}, {
    versionKey: false
})

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        require: true,
        unique: true
    }
}, {
    versionKey: false
})

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
}, {
    versionKey: false
})

// models with declared Schema
const Course = new mongoose.model("Course", courseSchema)
const Admin = new mongoose.model("Admin", adminSchema)
const RefreshToken = new mongoose.model("RefreshToken", refreshTokenSchema)


module.exports = {
    Admin,
    Course,
    RefreshToken,
} 