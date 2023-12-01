const mongoose = require('mongoose')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const scheme = mongoose.Schema({
    user: {
        type: ObjectId,
        required: [true, 'User is required']
    },

    fingerprint: {
        type: ObjectId,
        required: [true, 'Fingerprint is required']
    },

    token: {
        type: String,
        required: [true, 'Token is required']
    },

    ip_address: {
        type: String,
        required: [true, 'IP Address is required']
    },
})

let Session;

// if imported in more than 1 place error is thrown
try {
    Session = mongoose.model('Session');
} catch (error) {
    Session = mongoose.model('Session', scheme);
}

export default Session as any;