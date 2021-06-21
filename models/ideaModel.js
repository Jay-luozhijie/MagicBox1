const mongoose = require('mongoose');
const CommentModel = require('./commentModel');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
    },
    title: {
        type: String,
        required: [true, "please provide title"]
    },
    description: {
        type: String,
        required: [true, "please provide description"]
    },
    upVote: [{
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    comment: [
        { type: Schema.Types.ObjectId, ref: 'CommentModel' }
    ],
    doer: [{
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    collector: [{
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
    }]
})

IdeaSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await CommentModel.deleteMany({
            _id: {
                $in: doc.comment
            }
        })
    }
})

module.exports = mongoose.model('IdeaModel', IdeaSchema)
