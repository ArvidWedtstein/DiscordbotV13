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

const reactionroleSchema = new Schema({
    guildId: reqString,
    channelId: reqString,
    messageId: reqString,
    roles: [{
        emoji: reqString,
        roleId: reqString
    }]
})

const name: string = 'reaction-roles'
export default models[name] || model(name, reactionroleSchema)