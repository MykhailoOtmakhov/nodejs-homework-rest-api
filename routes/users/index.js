const express = require('express')
const router = express.Router()
const controlls = require('../../controllers/users')
const guard = require('../../helpers/guard')
const rateLimit = require('express-rate-limit')
const uploadAvatar = require('../../helpers/upload-avatar')

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 100 requests per windowMs
  handler: (req, res, next) => {
    return res.status(429).json({
      status: 'error',
      code: 429,
      message: 'Too many requests'
    })
  }
})

router.post('/signup', limiter, controlls.reg)
router.post('/login', controlls.login)
router.post('/logout', guard, controlls.logout)

router.patch('/avatars', guard, uploadAvatar.single('avatar'), controlls.updateAvatar)

router.get('/verify/:token', controlls.verify)
router.post('./verify', controlls.repeatEmailVerify)

module.exports = router
