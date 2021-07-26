const mongoose = require('mongoose')
const IdeaModel = require('../models/ideaModel')
const UserModel = require('../models/userModel')

mongoose.connect('mongodb://localhost:27017/IdeaV1', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
    console.log("Database connected")
})

const seedDB = async () => {
    const user = await UserModel.findById('60c5ddb2b171e75a48810f52')
    user.username="Jimmy"
    user.isVerified = true
    await user.save()
    console.log(user)
    // await IdeaModel.deleteMany({});
    // for (let i = 1; i <= 50; i++) {
    //     const idea1 = new IdeaModel({
    //         // author: `60d746baca590351d42cfcea`,
    //         author: `60f6885430d1ae2e00f3c222`,
    //         title: `NUS Map`,
    //         description: `I’m a freshman in NUS. I’m not familiar with the location of NUS venues and thus often lost my way. I’m not from SOC and don’t know how to build an app, but it would be nice if there is an app that contains the NUS map and can direct me to the correct location of lecture theatre where I attend lectures. Also, since looking at a cell phone while walking is dangerous, this app should provide audio guidance while I’m walking.
    //         It must be great if the app can work like Google Map!`,
    //         upVote: [],
    //         collector: [],
    //         doer: []
    //     })
    //     await idea1.save();
    //     const idea2 = new IdeaModel({
    //         // author: `60d4021721179d2678f85a3c`,
    //         author: `60dfd69ed12bf82550deea05`,
    //         title: `Umbrella problem`,
    //         description: `Our normal umbrellas only keep us safe during light rain. When it rains very hard, or when the wind tilts it down, we get wet even with our umbrellas.
    //         Who can design an umbrella that won't get me wet in rainy days?`,
    //         upVote: [],
    //         collector: [],
    //         doer: []
    //     })
    //     await idea2.save();
    // }
}

seedDB().then(() => {
    mongoose.connection.close();
})