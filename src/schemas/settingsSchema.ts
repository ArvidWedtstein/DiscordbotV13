import { Schema, model } from "mongoose"

const reqString = {
    type: String,
    required: true,
}
const reqBool = {
    type: String,
    default: true
}
const settingsSchema = new Schema({
    guildId: reqString,
    emotes: reqBool,
    money: reqBool,
    ticket: reqBool,
    swearfilter: reqBool,
    moderation: reqBool,
    currency: {
        type: String,
        default: 'ErlingCoin'
    },
    antijoin: {
        type: Boolean,
        default: false,
    },
    welcome: {
        type: Boolean,
        default: false
    },
    iconcolor: {
        type: String,
        default: "purple"
    },
    serverlog: {
        type: String,
        required: false
    },
    commands: {
        type: Object,
        required: false
    },
    levels: {
        type: Array,
        required: false
    },
    language: {
        type: String,
        required: true,
        default: 'english'
    }
})
export default model('settings', settingsSchema)