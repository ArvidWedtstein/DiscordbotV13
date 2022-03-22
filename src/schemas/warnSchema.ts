import { Schema, model } from "mongoose"

const warnSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    warnings: {
        type: [Object],
        required: true,
    }
})

export default model('warnings', warnSchema)