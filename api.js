const knex = require('./db')
const validator = require('validator')
const fs = require('fs');


module.exports = {
  getHealth,
  getStudent,
  getStudentGradesReport,
  getCourseGradesReport
}

async function getHealth(req, res, next) {
  try {
    await knex('students').first()
    res.json({
      success: true
    })
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
}

async function getStudent(req, res, next) {

  if (!validator.isInt(req.params.id, {
      min: 1
    })) {
    return res.status(400).send()
  }

  knex('students').where('id', req.params.id).asCallback(function (error, studentArray) {
    if (error) {
      console.log(error)
      return res.status(500).end()
    }
    const student = studentArray[0];
    return res.send(student)
  })

}

async function getStudentGradesReport(req, res, next) {

  if (!validator.isInt(req.params.id, {
      min: 1
    })) {
    return res.status(400).send()
  }


  knex('students').where('id', req.params.id).asCallback(function (error, studentArray) {
    if (error) {
      console.log(error)
      return res.status(500).end()
    }

    const student = studentArray[0];

    fs.readFile('grades.json', (error, data) => {
      if (error) {
        console.log(error)
        return res.status(500).end();
      }
      let grades = JSON.parse(data);

      grades = grades.filter((json) => json.id === student.id).map((grade) => {
        grade.id = undefined;
        return grade;
      })
      if(!grades.length){
        return res.status(404).send();
      }
      student.grades = grades
      return res.send(student);
    })


  })
}

async function getCourseGradesReport(req, res, next) {
  throw new Error('This method has not been implemented yet.')
}