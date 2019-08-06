const router = require('koa-router')()
const users = require('../controller/users')
const auth = require('../middleware/auth')

router.prefix('/api/user')

router.get('/list', auth, users.getList)

router.get('/info', auth, users.getUserInfo)

router.post('/save', auth, users.saveUser)

router.post('/delete', auth, users.deleteUser)

router.post('/login', users.login)

router.post('/logout', users.logout)

router.post('/register', users.register)

module.exports = router
