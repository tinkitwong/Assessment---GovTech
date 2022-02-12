const router = require('express').Router()
const householdController = require('../controllers/household.controller.js')

/**
Contain house CRUD routes
**/

// Create Household
router.post("/create", householdController.create)

// Add Family Member to Household
// route.put("/addMember", household.addFamilyMember)

// List Households

// Show Household

// Search for households and receipients of grant disbursement

module.exports = router