const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    follower: [{
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    idea: [{
        type: Schema.Types.ObjectId,
        ref: 'IdeaModel',
    }],
    likePost: [{
        type: Schema.Types.ObjectId,
        ref: 'IdeaModel'
    }],
    collect: [{
        type: Schema.Types.ObjectId,
        ref: 'IdeaModel'
    }],
    doingPost: [{
        type: Schema.Types.ObjectId,
        ref: 'IdeaModel'
    }],
    finishedPost: [{
        type: Schema.Types.ObjectId,
        ref: 'IdeaModel'
    }]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('UserModel', UserSchema)
