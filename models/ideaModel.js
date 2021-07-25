const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CommentModel = require('./commentModel')

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
    images:[{
        url:String,
        filename:String
    }],
    deleted:{
        type:Boolean
    },
    answer:[{
        type: Schema.Types.ObjectId,
        ref: 'AnswerModel'
    }],
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
IdeaSchema.index({'title': 'text','description': 'text'});

module.exports = mongoose.model('IdeaModel', IdeaSchema)
