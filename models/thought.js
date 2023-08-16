const { Schema, model } = require('mongoose');
const reactionSchema = require("./reaction");

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        username: {
            type: String,
            required: true,
        },
        reaction: [
            reactionSchema
        ],
    },
    {
        toJSON: {
            getters: true,
        },
    },
);

thoughtSchema
    .virtual("reactionCount")

    .get(function () {
        return this.reactions.length
    })

const Thoughts = model( "Thought", thoughtSchema );

module.exports = Thoughts;