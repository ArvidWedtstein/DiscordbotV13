import { Schema, model } from "mongoose"

const playlistSchema = new Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    playlist: {
        type: [Object],
        required: true,
    }
})

export default model('playlist', playlistSchema);