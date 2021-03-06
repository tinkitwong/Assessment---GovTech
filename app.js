const express = require('express')
const app = express()
require('dotenv').config()

/** MW Config */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// DB setup
const db = require('./models/')
db.sequelize.sync({ alter: true, force: true }).then((res) => {
    // console.log('Checked current db state and made necessary changes to match defined models')
}).catch((err) => {
    throw err
})

// MVC pattern
app.use('/api/household', require('./routes/household.routes'))
app.use('/api/person', require('./routes/person.routes'))
app.use('/api/grants', require('./routes/grants.routes'))


// Error Handling
app.use((err, req, res, next) => {
    // console.log(err)
    res.status(err.status || 500)
    res.send({
        message : 'Internal Server Error'
    })
})


if (process.env.NODE_ENV === 'test') {
    module.exports = app;
} else {
    app.listen(process.env.DEVPORT || 8080, () => {
        console.log(`Server running on ${process.env.DEVPORT}`)
    })
}