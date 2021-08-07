const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AnswerSchema = new Schema({
    author: {
        type: Schema.Types.ObjectId,
        ref: 'UserModel',
        required: true,
    },
    content: {
        type: String,
        required: [true, "please provide content"]
    },
    images:[{
        url:String,
        filename:String
    }],
    comment: [
        { type: Schema.Types.ObjectId, ref: 'CommentModel' }
    ],
    idea: {
        type: Schema.Types.ObjectId,
        ref: 'IdeaModel'
    },
})

module.exports = mongoose.model('AnswerModel', AnswerSchema)