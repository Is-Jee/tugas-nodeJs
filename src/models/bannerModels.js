const mongoose = require("mongoose")

const bannerSchema = mongoose.Schema({
    title: {
        type: String
    },
    image: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("Banner", bannerSchema)