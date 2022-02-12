const express = require('express')
const app = express()
require('dotenv').config()

/** MW Config */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// DB setup
const db = require('./db/models')
db.sequelize.sync({ force: true }).then((res) => {
    console.log('Checked current db state and made necessary changes to match defined models')
}).catch((err) => {
    throw(err)
})

// MVC pattern
// app.use('/api/db', require('./db/routes/general.routes'))
app.use('/api/household', require('./household/routes/household.routes'))

// app.use('/', (req, res)=>{console.log('hello')})

// Error Handling
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err)
})

app.listen(process.env.DEVPORT || 8080, () => {
    console.log(`Server running on ${process.env.DEVPORT}`)
})