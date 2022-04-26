import { Schema, model, models } from "mongoose"
const reqNumber = {
    type: Number,
    required: true
}
const reqString = {
    type: String,
    required: true
}
const reqDate = {
    type: Date,
    required: true
}
const reactionrole = new Schema({
    guildId: reqString,
    channelId: reqString,
    messageId: reqString,
    roles: [{
        emoji: reqString,
        roleId: reqString
    }]
    
})

const name: string = 'reaction-roles2'
export default models[name] || model(name, reactionrole)