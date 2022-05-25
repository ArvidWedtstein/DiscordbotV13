import { Schema, model, models } from "mongoose"

const reqString = {
    type: String,
    required: true,
}

const profileSchema = new Schema({ 
    guildId: reqString,
    userId: reqString,
    steamId: {
        type: String, 
        required: false
    },
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
    brawlhallaId: {
        type: String,
        required: false
    },
    brawlhalla: {
        type: Boolean,
        default: false
    },
    brawlhallaStats: {
        type: Boolean,
        default: false
    },
    brawlhallacodes: {
        type: [{
            code: {
                type: String,
            },
            name: {
                type: String,
            },
            redeemed: {
                type: Boolean,
                default: false
            },
        }],
        required: false
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
    guessedWords: {
        type: [Object],
        required: false,
        default: []
    },
    joinedDate: {
        type: Date,
        required: false
    }
})
const name: string = 'profiles'
export default models[name] || model(name, profileSchema)