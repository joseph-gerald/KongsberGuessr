const mongoose = require('mongoose')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const scheme = Schema({
    creator: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'Creator is required']
    },

    session: {
        type: ObjectId,
        ref: 'Session',
        required: [true, 'Session is required']
    },

    game_id: {
        type: String,
        required: [true, 'Game id is required']
    },

    timestamp: {
        type: Date,
        required: [true, 'Timestamp is required']
    },

    mode: {
        type: String,
        required: [true, 'Mode is required']
    },

    settings: {
        type: Object,
    },
}, {
    timestamps: true
})

let Game;

// if imported in more than 1 place error is thrown
try {
    Game = mongoose.model('Game');
} catch (error) {
    Game = mongoose.model('Game', scheme);
}

export default Game as any;