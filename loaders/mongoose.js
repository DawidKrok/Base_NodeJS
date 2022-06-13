require('dotenv').config()
const mongoose = require('mongoose')

const url = process.env.MONGO_URL

mongoose.connect(url, {
    // some settings for better mongoose performance
    useNewUrlParser: true,
    useUnifiedTopology: true
})