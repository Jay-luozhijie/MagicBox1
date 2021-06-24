const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReplySchema = new Schema({
    author:{
        type:Schema.Types.ObjectId,
        ref:'UserModel',
    },
    replyTo:{
        type:Schema.Types.ObjectId,
        ref:'UserModel',
    },
    replyBody: {
        type:String,
        required: true,
    }
})

module.exports = mongoose.model('ReplyModel', ReplySchema)