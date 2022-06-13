const router = require('express').Router()
const coursesServices = require('../services/coursesServices')
const tokenServices = require('../services/tokenServices')


//&&&&&&&&&&&&&| POST METHODS |&&&&&&&&&&&&&&
/** =============
 *     COURSES
 * ============= */

/** Adds new Course with given name, and returns it
 * req.body:
 * @title : title of the new course 
 * @published_on : Date on which course was published (optional)
 * @takes_place_on : Date on which course takes place 
 * @img_link : String with link to corresponding img 
 * @description : String with description of course */
router.post("/add_course",  coursesServices.addCourse)
 
 /** Returns all Courses documents from database */
router.post("/get_all_courses", coursesServices.getAllCourses)
 
 /** Returns Course with given id 
  * req.body:
  * @id : id of course to return */
router.post("/get_course", coursesServices.getCourse)


 /** Deletes Course with given id 
  * req.body:
  * @id : id of course to delete */
router.post("/delete_course", tokenServices.authenticateToken, coursesServices.deleteCourse)


module.exports = router
