import { Schema, model } from "mongoose"
const swearfilterSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    swearwords: {
        type: [String],
        required: true,
    }
})

export default model('swearwords', swearfilterSchema)