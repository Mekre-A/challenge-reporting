const knex = require('./db')
const validator = require('validator')

module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth (req, res, next) {
  try {
    await knex('students').first()
    res.json({ success: true })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent (req, res, next) {

  if(!validator.isInt(req.params.id, {min:1})){
    return res.status(400).send()
  }

  knex('students').where('id', req.params.id).asCallback(function(err, student){
    if(err){
     console.log(e)
     return res.status(500).end()
    }
    console.log(student)
   return res.send(student)
  })
  
}

async function getStudentGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}

async function getCourseGradesReport (req, res, next) {
  throw new Error('This method has not been implemented yet.')
}
