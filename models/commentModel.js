const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'UserModel',
    },
    commentBody: {
        type:String,
        required: true,
    }
})

module.exports = mongoose.model('CommentModel', CommentSchema)