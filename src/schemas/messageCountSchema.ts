import { Schema, model } from "mongoose"
const reqNumber = {
    type: Number,
    required: true,
    default: 0
}
const reqString = {
    type: String,
    required: true
}
const reqDate = {
    type: Date,
    required: true
}
const messageCountSchema = new Schema({
    userId: reqString,
    guildId: reqString,
    messageCount: reqNumber,
})

export default model('message-counts', messageCountSchema)