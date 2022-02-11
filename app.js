const express = require('express')
const res = require('express/lib/response')
const app = express()
require('dotenv').config()

// DB setup
const db = require('./db/models')
db.sequelize.sync({ alter: true })
.then((res) => {
    console.log('Checked current db state and made necessary changes to match defined models')
})
.catch((err) => {
    throw(err)
})

// MVC pattern
// app.use('/api/db', require('./db/routes/general.routes'))
app.use('/api/household', require('./household/routes/household.routes'))

// Error Handling
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err)
})

app.listen(process.env.DEVPORT || 8080, () => {
    console.log(`Server running on ${process.env.DEVPORT}`)
})