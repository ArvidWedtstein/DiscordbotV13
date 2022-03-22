import { Schema, model } from "mongoose"


const reqString = {
    type: String,
    required: true
}
const welcomeSchema = new Schema({
    guildId: reqString,
    channelId: reqString,
    text: reqString
})

export default model('welcome-channels', welcomeSchema)