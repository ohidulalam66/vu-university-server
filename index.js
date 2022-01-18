const express = require('express')
const app = express()
const cors = require('cors')
const { MongoClient } = require('mongodb')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId
const { ObjectID } = require('bson')

const port = process.env.PORT || 5000

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5qzra.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

async function run() {
  try {
    await client.connect()
    const database = client.db('vu_university')
    const courseCollection = database.collection('courses')

    // POST Add Courses
    app.post('/courses', async (req, res) => {
      const course = req.body
      const result = await courseCollection.insertOne(course)
      res.json(result)
    })

    // GET all Orders API
    app.get('/courses', async (req, res) => {
      const cursor = courseCollection.find({})
      const courses = await cursor.toArray()
      res.send(courses)
    })

    // DELETE single Order API
    app.delete('/courses/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await courseCollection.deleteOne(query)
      res.json(result)
    })
  } finally {
    // await client.close();
  }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Vu University')
})

app.listen(port, () => {
  console.log(`server Running:${port}`)
})
