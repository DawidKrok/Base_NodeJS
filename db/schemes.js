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

// models with declared Schema
const Course = new mongoose.model("Place", courseSchema)
const RefreshToken = new mongoose.model("RefreshToken", refreshTokenSchema)


module.exports = {
    Course,
    RefreshToken,
} 