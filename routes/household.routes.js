const router = require('express').Router()
const householdController = require('../controllers/household.controller.js')
const personController = require('../controllers/person.controller.js')

/**
Contain house CRUD routes
**/

// Create Household
router.post("/create", householdController.create)

// Add Family Member to Household
router.post("/addMember", householdController.addFamilyMember)

// List Households
router.get("/", householdController.findAll)

// Show Household

// Search for households and receipients of grant disbursement

module.exports = router