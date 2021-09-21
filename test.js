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

tape('Request for student data with valid and existing id should return with a correct object', (t) => {
  const url = `${endpoint}/student/34`
    jsonist.get(url, (error, data, response) =>{
     t.equal(200, response.statusCode)
     t.deepEqual(data, {
        id: 34,
        first_name: 'Moises',
        last_name: 'Kling',
        email: 'Moises26@hotmail.com',
        is_registered: 0,
        is_approved: 0,
        password_hash: '17507d691d0e6f64ff499f794979becb52e52429',
        address: '1954 Klein Knolls Apt. 705',
        city: 'Kenner',
        state: 'IN',
        zip: '52338',
        phone: '312-563-9489 x045',
        created: '1628722431044.0',
        last_login: '1628750813796.0',
        ip_address: '211.59.92.11'
      })
      t.end()
    })
})

tape('Request for a student information should not take more than 500 ms', (t) => {
  const url = `${endpoint}/student/34`
    t.timeoutAfter(500)
    jsonist.get(url, (error, data, response) =>{ 
     t.equal(200, response.statusCode)
      t.end()
    })
})

tape('Request for a student information with a valid but non-existing id should return 404', (t) => {
  const url = `${endpoint}/student/1000001`
    jsonist.get(url, (error, data, response) =>{ 
     t.equal(404, response.statusCode)
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


tape('Request for grades of a student with valid id should return the correct amount of grades of a student', (t) => {
  const url = `${endpoint}/student/1/grades`
    jsonist.get(url, (error, data, response) =>{
     t.equal(200, response.statusCode)
     t.equal(data.grades.length, 4)
     t.end()
    })
})

tape(`Request for a student's grade information should not take more than 500 ms`, (t) => {
  const url = `${endpoint}/student/34/grades`
    t.timeoutAfter(500)
    jsonist.get(url, (error, data, response) =>{ 
     t.equal(200, response.statusCode)
      t.end()
    })
})

tape('Request for grades of a student with valid id should return the correct grades of a student along with the student information', (t) => {
  const url = `${endpoint}/student/2/grades`
    jsonist.get(url, (error, data, response) =>{
     t.equal(200, response.statusCode)
     t.deepEqual(data, {
        id: 2,
        first_name: 'Norwood',
        last_name: 'Swift',
        email: 'Norwood.Swift@hotmail.com',
        is_registered: 1,
        is_approved: 0,
        password_hash: 'b869fb32d6b011ee661483c1b3989829984a68eb',
        address: '41595 Miller Forks Suite 966',
        city: 'Urbana',
        state: 'WV',
        zip: '79106',
        phone: '(816) 514-7643 x5654',
        created: '1628752628336.0',
        last_login: '1628784980084.0',
        ip_address: '198.149.242.185',
        grades: [
          { course: 'Calculus', grade: 9 },
          { course: 'Microeconomics', grade: 11 }
        ]
      })
     t.end()
    })
})

tape('Request for grades of a student information with a valid but non-existing id should return 404', (t) => {
  const url = `${endpoint}/student/1000001/grades`
    jsonist.get(url, (error, data, response) =>{ 
     t.equal(404, response.statusCode)
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

tape(`Request for all courses with their stats should not take more than 500 ms`, (t) => {
  const url = `${endpoint}/course/all/grades`
    t.timeoutAfter(500)
    jsonist.get(url, (error, data, response) =>{ 
     t.equal(200, response.statusCode)
      t.end()
    })
})

tape('cleanup', function (t) {
  server.closeDB()
  server.close()
  t.end()
})
