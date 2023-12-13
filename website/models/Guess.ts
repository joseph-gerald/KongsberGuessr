const mongoose = require('mongoose')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const scheme = Schema({
    user: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },

    // game data

    game: {
        type: ObjectId,
        ref: 'Game',
        required: [true, 'Game is required']
    },

    round: {
        type: Number,
        required: [true, 'Round is required']
    },

    // time

    start_time: {
        type: Date,
        required: [true, 'Start time is required']
    },
    time_taken: {
        type: Number,
        required: [true, 'Time taken is required']
    },

    // scoring data

    score: {
        type: Number,
        required: [true, 'Score is required']
    },

    distance: {
        type: Number,
        required: [true, 'Distance is required']
    },

    // answer location
    answer_lat: {
        type: Number,
        required: [true, 'Answer latitude is required']
    },
    answer_lng: {
        type: Number,
        required: [true, 'Answer longitude is required']
    },

    // guess location
    guess_lat: {
        type: Number,
        required: [true, 'Guess latitude is required']
    },
    guess_lng: {
        type: Number,
        required: [true, 'Guess longitude is required']
    },
}, {
    timestamps: true
})

let Guess;

// if imported in more than 1 place error is thrown
try {
    Guess = mongoose.model('Guess');
} catch (error) {
    Guess = mongoose.model('Guess', scheme);
}

export default Guess as any;