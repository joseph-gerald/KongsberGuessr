const mongoose = require('mongoose')

const scheme = mongoose.Schema({
    hash: {
        type: String,
    },
    encoded_data: {
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