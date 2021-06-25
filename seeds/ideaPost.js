
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
    await IdeaModel.deleteMany({});
    for (let i = 1; i <= 50; i++) {
        const idea = new IdeaModel({
            author: `60c5ddb2b171e75a48810f52`,

            title: `idea${i}`,
            description: `this is the description of idea${i}this is the description of idea${i}this is the description of idea${i}
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam neque libero quisquam impedit consequatur fugiat ipsa
                nisi, architecto eum a assumenda corrupti voluptatum totam sit odit molestias ab natus iusto!
                Accusantium repellendus ex assumenda distinctio, quos quia vitae, deleniti est saepe perferendis maxime iusto labore
                illo odit incidunt officiis eius! Facilis sint similique possimus placeat. Pariatur optio expedita deleniti quae.
                Soluta perspiciatis itaque quod quam provident similique error neque nostrum magnam numquam aspernatur repellendus
                assumenda libero qui modi praesentium impedit perferendis laboriosam doloremque tenetur, corporis, vero dolorum? Sunt,
                porro veritatis.
                Excepturi dignissimos sapiente eius cumque veniam saepe aut itaque magnam expedita earum cum, eligendi eum optio
                reiciendis reprehenderit provident sed rerum doloremque qui perferendis alias. Eveniet rem nemo eaque quas?
                Reiciendis unde amet totam, nihil praesentium, saepe doloribus, deserunt deleniti sunt commodi nostrum ad veniam facere
                exercitationem illo hic doloremque sint cupiditate quod explicabo pariatur fuga at expedita voluptates. Nisi!`,
            upVote: [],
            collector: [],
            doer: []
        })
        await idea.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})