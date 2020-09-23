import express from 'express'
import { currentUser } from '@m1cr0s3rv1c3s/common'

const router = express.Router()

router.get(
  '/api/users/currentuser',
  currentUser,
  async (req, res) => {
    res.send({ currentUser: req.currentUser || null })
  }
)

export { router as currentUserRouter }
