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
})

module.exports = mongoose.model('AnswerModel', AnswerSchema)