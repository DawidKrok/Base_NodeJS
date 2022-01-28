const Course = require('../db/schemes').Course


// &&&&&&&&&&&&&&&& | GETTING DATA | &&&&&&&&&&&&&&&

/** @Sends : all saved Courses corresponding to given @city from database */
getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().lean()
        res.status(202).send(courses)
    } catch(err) {
        res.sendStatus(500)
        console.log(err) 
    }
}

/** @Sends : Course from database of given @id */
getCourse = async (req, res) => {
    try {
        if(!req.body.id)  return res.sendStatus(400)

        res.status(202).send(JSON.stringify(
            await Course.findById(req.body.id).lean()
        ))
    } catch(err) {
        res.sendStatus(500)
        console.log(err) 
    }
}


// &&&&&&&&&&&&&&&& | SETTING DATA | &&&&&&&&&&&&&&&
/** @Adds : new Course to database */
addCourse = async (req, res) => {
    try {
        if(!req.body.name || !req.body.type || !req.body.img_url || !req.body.price || !req.body.length_in_hours)  
            return res.sendStatus(400)

        const course = new Course({
            name: req.body.name,
            type: req.body.type,
            img_url: req.body.img_url,
            price: req.body.price,
            length_in_hours: req.body.length_in_hours,
            description: req.body.description || "No desription yet.",
        })
        await course.save()

        res.status(202).send(JSON.stringify(course))
    } catch(err) {
        res.sendStatus(500)
        console.log(err) 
    }
}

/** @Deletes : Course from database */
deleteCourse = async (req, res) => {
    try {
        if(!req.body.id)  return res.sendStatus(403)

        Course.deleteOne({_id: req.body.id}, err => {
            if(err) return res.sendStatus(400)
            
            res.sendStatus(202)
        })

       
    } catch(err) {
        res.sendStatus(500)
        console.log(err) 
    }
}

module.exports = {
    addCourse,
    getAllCourses,
    getCourse,
    deleteCourse
}