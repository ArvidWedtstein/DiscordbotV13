import mongoose from 'mongoose'
const reqString = {
    type: String,
    required: true
}
export interface emote {
    name: String,
    
}
const emoteSchema = new mongoose.Schema({
    guildId: reqString,
    emotes: {
        type: Array
    },
})

export default mongoose.model('emotes', emoteSchema);