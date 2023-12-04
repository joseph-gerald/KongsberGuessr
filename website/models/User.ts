const mongoose = require('mongoose')

const scheme = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        validate: {
            validator: function (value: any) {
                return value.length >= 8
            },
            message: () => 'Password must be at least 8 characters long'
        }
    },

    xp: {
        type: Number,
        default: 0,
    },
})

let User;

// if imported in more than 1 place error is thrown
try {
    User = mongoose.model('User');
} catch (error) {
    User = mongoose.model('User', scheme);
}

export default User as any;