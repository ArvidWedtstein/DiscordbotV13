import { Schema, model, models } from "mongoose"

const reqString = {
    type: String,
    required: true,
}

const profileSchema = new Schema({ 
    guildId: reqString,
    userId: reqString,
    coins: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 10,
    },
    birthday: {
        type: String,
        default: '1/1',
    },
    brawlhalla: {
        type: Boolean,
        default: false
    },
    warns: {
        type: [Object],
        default: [],
    },
    items: {
        type: [Object],
        required: true,
    },
    messageCount: {
        type: Number,
        required: true,
        default: 0
    },
    joinedDate: {
        type: Date,
        required: false
    }
})
const name: string = 'profiles'
export default models[name] || model(name, profileSchema)