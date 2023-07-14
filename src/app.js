require('dotenv').config()
const express = require("express")
const app = express()
const connectToDatabase = require('../config/db.js')
const Router = require('../routes/routes.js')
const cookieParser = require('cookie-parser')

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

connectToDatabase()

app.use('/api/auth', Router)

app.use('/', (req, res) => {
    return res.status(200).json({
        success: false,
        message: 'Successfully running server'
    })
})

module.exports = app;