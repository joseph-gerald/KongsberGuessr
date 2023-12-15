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

    // start location
    start_lat: {
        type: Number,
        required: [true, 'Start latitude is required']
    },
    start_lng: {
        type: Number,
        required: [true, 'Start longitude is required']
    },

    // end location
    end_lat: {
        type: Number,
        required: [true, 'Guess latitude is required']
    },
    end_lng: {
        type: Number,
        required: [true, 'Guess longitude is required']
    },

    // final location
    final_lat: {
        type: Number,
        required: [true, 'Final latitude is required']
    },
    final_lng: {
        type: Number,
        required: [true, 'Final longitude is required']
    }
}, {
    timestamps: true
})

let Navigation;

// if imported in more than 1 place error is thrown
try {
    Navigation = mongoose.model('Navigation');
} catch (error) {
    Navigation = mongoose.model('Navigation', scheme);
}

export default Navigation as any;