const personController = require('../controllers/person.controller.js')
const router = require('express').Router()

router.post('/create', personController.create)


module.exports = router 