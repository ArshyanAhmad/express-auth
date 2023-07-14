const mongoose = require('mongoose')
const JWT = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required.'],
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        validate: {
            validator: function (value) {
                // Regular expression to validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return emailRegex.test(value);
            },
            message: 'Invalid email format.'
        }
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        minlength: [6, 'Password should be at least 6 characters long.'],
        select: false
    },
    confirmPassword: {
        type: String,
        required: [true, 'Confirm Password is required.'],
        validate: {
            validator: function (value) {
                // Access the `password` field using `this`
                return value === this.password;
            },
            message: 'Passwords do not match.'
        }
    }
});

userSchema.methods = {
    jwtToken() {
        const payload = {
            id: this._id,
            email: this.email
        }

        const options = {
            expiresIn: '24h'
        }

        const SECRET = process.env.SECRET

        return JWT.sign(payload, SECRET, options)
    }
}

module.exports = mongoose.model('User', userSchema)