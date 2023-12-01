const mongoose = require('mongoose')

const scheme = mongoose.Schema({
    hash: {
        type: String,
        required: [true, 'Hash is required']
    },
    data: {
        type: String,
        required: [true, 'Data is required']
    },
})

let Fingerprint;

// if imported in more than 1 place error is thrown
try {
    Fingerprint = mongoose.model('Fingerprint');
} catch (error) {
    Fingerprint = mongoose.model('Fingerprint', scheme);
}

export default Fingerprint as any;