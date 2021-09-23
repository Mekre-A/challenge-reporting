const knex = require('./db')
const validator = require('validator')
const fs = require('fs');
const grades = require('./grades.json')


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
    if(!studentArray.length){
        return res.status(404).send();
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

    if(!studentArray.length){
        return res.status(404).send();
      }

    const student = studentArray[0];

    let studentGrades = []
      

      studentGrades = grades.filter((json) => json.id === student.id)
      if(!studentGrades.length){
        return res.status(404).send();
      }
      student.grades = studentGrades
      return res.send(student);


  })
}


async function getCourseGradesReport(req, res, next) {
  let uniqueCourses = [];
  let courseStat = {};
      

      grades.forEach((grade) =>{
        if(courseStat[grade.course] != null){
          if(courseStat[grade.course]['highest'] < grade.grade){
           courseStat[grade.course]['highest'] = grade.grade
          } 
          else if(courseStat[grade.course]['lowest'] > grade.grade){
           courseStat[grade.course]['lowest'] = grade.grade
          }
          courseStat[grade.course]['total'] = courseStat[grade.course]['total'] + grade.grade
         courseStat[grade.course]['count'] = courseStat[grade.course]['count'] + 1

        } else{
          uniqueCourses.push(grade.course)
          courseStat[grade.course] = {}
          courseStat[grade.course]['highest'] = grade.grade
          courseStat[grade.course]['lowest'] = grade.grade
          courseStat[grade.course]['total'] = grade.grade
          courseStat[grade.course]['count'] = 1
        }
      
      })

      

     uniqueCourses.forEach(element => {
       courseStat[element]['averageGrade'] = (courseStat[element]['total']/courseStat[element]['count']).toFixed(2)
       courseStat[element]['total'] = undefined;
       courseStat[element]['count'] = undefined;
     });

      res.send(
        courseStat
      );
}