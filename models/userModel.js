const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    idea: [{
        type: Schema.Types.ObjectId,
        ref: 'ideaModel',
    }],
    likePost: [{
        type: Schema.Types.ObjectId,
        ref: 'ideaModel'
    }],
    following: [{
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    }],
    follower: [{
        type: Schema.Types.ObjectId,
        ref: 'UserModel'
    }]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('UserModel', UserSchema)
