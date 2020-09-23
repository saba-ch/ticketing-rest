import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

declare global {
  namespace NodeJS {
    interface Global {
      signin(): [string]
    }
  }
}

jest.mock('../nats-wrapper')


let mongo: any

beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf'

  mongo = new MongoMemoryServer()
  const mongoUri = await mongo.getUri()

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
})

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections()
  for(const collection of collections) {
    await collection.deleteMany({})
  }
})

afterAll(async () => {
  await mongo.stop()
  await mongoose.connection.close()
})

global.signin = () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  const payload = { id, email: 'test@test.com' }

  const jwtKey = jwt.sign(payload, process.env.JWT_KEY!)
  const session = JSON.stringify({ jwt: jwtKey })
  const base64 = Buffer.from(session).toString('base64')

  return [`express:sess=${base64}`]
}