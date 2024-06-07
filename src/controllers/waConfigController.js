const asyncHandler = require("express-async-handler");
const Wa_config = require("../models/whatsappConfigurationModels");


const addToken = asyncHandler(async (req, res ) => {
    const {token} = req.body
    const id = "652c8b3f322f9451f58e1e1e"

    if (token.trim().length <= 5) {
        res.status(401)
        throw new Error("Token not valid")
    } 
 
    await Wa_config.findByIdAndUpdate(id, {token})

    res.status(201).json({message: "Success add token"})
})

const getToken = asyncHandler(async (req, res) => {
    const id = "652c8b3f322f9451f58e1e1e"

    const token = await Wa_config.findById(id)

    res.status(200).json(token)
})

module.exports = { addToken, getToken };