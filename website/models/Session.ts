const mongoose = require('mongoose')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const scheme = mongoose.Schema({
    user: {
        type: ObjectId,
    },

    fingerprint: {
        type: ObjectId,
    },

    address: {
        type: String,
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