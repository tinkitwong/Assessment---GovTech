const router = require('express').Router()
const grantsController = require('../controllers/grants.controller.js')

// Search for households and receipients of grant disbursement
router.get('/checkEligibility', grantsController.checkEligibility)


module.exports = router