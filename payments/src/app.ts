import express from 'express'
import 'express-async-errors'
import { json } from 'body-parser'
import cookieSession from 'cookie-session'
import { errorHandler, NotFoundError, currentUser } from '@m1cr0s3rv1c3s/common'

import { newChargeRouter } from './routes/new'

const app = express()
app.set('trust proxy', true)
app.use(json())
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test'
  })
)

app.use(currentUser)
app.use(newChargeRouter)

app.all('*', () => {
  throw new NotFoundError()
})

app.use(errorHandler)


export { app }