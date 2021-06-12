const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema=new Schema({
    title: {
        type: String,
        required: [true, "please provide title"]
    },
    description: {
        type: String,
        required: [true, "please provide description"]
    },
    upVote:Number,
    downVote:Number
})

module.exports = mongoose.model('IdeaModel', IdeaSchema)
