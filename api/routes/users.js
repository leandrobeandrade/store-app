const express = require('express')
const router = express.Router()

const usersCTRL = require('../controllers/users-ctrl')

router.get('/', usersCTRL.getUsers)

router.post('/cadastro', usersCTRL.cadastroUsers)

router.delete('/', usersCTRL.deleteUser)

router.post('/login', usersCTRL.login)


module.exports = router