const { Schema, model } = require('mongoose');

const reactionSchema = new Schema(
    {
        reactionId: {
            value: something,
            default: new ObjectId,
        },
        reactionBody: {
            type: String,
            required: true,
            max_length: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            date: new Date,
            default: Date.now(),
        }
    }
);

module.exports = Reactions;