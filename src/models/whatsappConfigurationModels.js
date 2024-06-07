const mongoose = require("mongoose")

const waConfigSchema = mongoose.Schema({
    token: {
        type: String,
        required: true
    },
})

module.exports = mongoose.model("Wa_config", waConfigSchema)