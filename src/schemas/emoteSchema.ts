import { Schema, model, models } from "mongoose"
const reqString = {
    type: String,
    required: true
}
export interface emote {
    name: String,
    
}
const emoteSchema = new Schema({
    guildId: reqString,
    emotes: {
        type: Array
    },
})
const name: string = 'emotes'
export default models[name] || model(name, emoteSchema)