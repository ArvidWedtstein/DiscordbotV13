import { Schema, model } from "mongoose"

const swearSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    swear: {
        type: [Object],
        required: true,
    }
})
export default model('swear', swearSchema)