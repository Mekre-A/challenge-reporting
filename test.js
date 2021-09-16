const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`

const server = require('./server')

tape('health', async function (t) {
  const url = `${endpoint}/health`
  try {
    const { data, response } = await jsonist.get(url)
    if (response.statusCode !== 200) {
      throw new Error('Error connecting to sqlite database; did you initialize it by running `npm run init-db`?')
    }
    t.ok(data.success, 'should have successful healthcheck')
    t.end()
  } catch (e) {
    t.error(e)
  }
})


tape('Request for student data with valid and existing id should return with 200', (t) => {
  const url = `${endpoint}/student/22`
    jsonist.get(url, (error, data, response) =>{
     t.equal(200, response.statusCode)
      t.end()
    })
})

tape('Request for student data with invalid id should return 400', (t) => {
  const url = `${endpoint}/student/0`
    jsonist.get(url, (error, data, response) =>{
     t.equal(400, response.statusCode)
      t.end()
    })
})


tape('Request for grades of a student with valid id should return the grades of a student', (t) => {
  const url = `${endpoint}/student/1/grades`
    jsonist.get(url, (error, data, response) =>{
     t.equal(200, response.statusCode)
     t.equal(data.grades.length, 4)
     t.end()
    })
})

tape('Request for grades of a student with valid id but no entry in the grades.json should return 404', (t) => {
  const url = `${endpoint}/student/20/grades`
    jsonist.get(url, (error, data, response) =>{
     t.equal(404, response.statusCode)
      t.end()
    })
})

tape('Request for grades of a student with invalid id for grades should return 400', (t) => {
  const url = `${endpoint}/student/asdf/grades`
    jsonist.get(url, (error, data, response) =>{
     t.equal(400, response.statusCode)
      t.end()
    })
})



tape('Request for all courses with their stats should return 200', (t) => {
  const url = `${endpoint}/course/all/grades`
    jsonist.get(url, (error, data, response) =>{
     t.equal(200, response.statusCode)
     
     t.equal(data.Calculus.averageGrade,"50.09")
     t.equal(data.Calculus.highest,100)
     t.equal(data.Calculus.lowest,0)

     t.equal(data.Microeconomics.averageGrade,"49.81")
     t.equal(data.Microeconomics.highest,100)
     t.equal(data.Microeconomics.lowest,0)

     t.equal(data.Statistics.averageGrade,"50.02")
     t.equal(data.Statistics.highest,100)
     t.equal(data.Statistics.lowest,0)

     t.equal(data.Astronomy.averageGrade,"50.04")
     t.equal(data.Astronomy.highest,100)
     t.equal(data.Astronomy.lowest,0)

     t.equal(data.Philosophy.averageGrade,"50.02")
     t.equal(data.Philosophy.highest,100)
     t.equal(data.Philosophy.lowest,0)
      t.end()
    })
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
