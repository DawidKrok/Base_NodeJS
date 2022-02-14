const mongoose = require('mongoose')

const url = "mongodb://mo12854_Krokemy:Asfalt1756@mongo.ct8.pl:27017/mo12854_Krokemy"

mongoose.connect(url, {
    // some settings for better mongoose performance
    useNewUrlParser: true,
    useUnifiedTopology: true
})