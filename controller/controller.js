const validator = require('email-validator')
const userModel = require('../models/models.js')

const messageTemplate = {
    success: false,
    message: '',
    data: null
}

const signup = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name, !email, !password, !confirmPassword) {
        messageTemplate.success = false
        messageTemplate.message = 'All fields are required'

        return res.status(400).json(messageTemplate)
    }

    if (password !== confirmPassword) {
        messageTemplate.success = false
        messageTemplate.message = 'password ditn"t matched'

        return res.status(400).json(messageTemplate)
    }

    const validEmail = validator.validate(email)
    if (!validEmail) {
        messageTemplate.success = false
        messageTemplate.message = 'Email is incorrect'

        return res.status(400).json(messageTemplate)
    }

    try {
        const userInfo = userModel(req.body)
        const result = await userInfo.save()

        messageTemplate.success = true
        messageTemplate.message = 'Data saved successfully'
        messageTemplate.data = result

        return res.status(201).json(messageTemplate)
    } catch (error) {

        if (error.code === 11000) {
            messageTemplate.success = false
            messageTemplate.message = `User already exits`

            return res.status(400).json(messageTemplate)
        }

        messageTemplate.success = false
        messageTemplate.message = `Error while saving data: ${error.message}`

        return res.status(400).json(messageTemplate)
    }

}

const signin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        messageTemplate.success = false
        messageTemplate.message = 'All fields are mendatory'

        return res.status(400).json(messageTemplate)
    }

    const user = await userModel.findOne({ email }).select("+password")
    console.log(user);
    console.log(email, password);

    if (!user || user.password !== password) {
        messageTemplate.success = false
        messageTemplate.message = 'Sign in failed'

        return res.status(400).json(messageTemplate)
    }

    try {
        const TOKEN = user.jwtToken()
        user.password = undefined
        user.confirmPassword = undefined

        const cookieOption = {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true
        }

        res.cookie('token', TOKEN, cookieOption)

        messageTemplate.success = true
        messageTemplate.message = 'Sign in successfully'
        messageTemplate.data = user

        return res.status(200).json(messageTemplate)
    } catch (error) {
        messageTemplate.success = false
        messageTemplate.message = `Sign in unsuccessfully: ${error.message}`
        messageTemplate.data = user

        return res.status(400).json(messageTemplate)
    }

}

const getuser = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await userModel.findById(userId)
        user.confirmPassword = undefined

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    signup,
    signin,
    getuser,
}