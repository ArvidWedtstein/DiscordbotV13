import { Schema, model } from "mongoose"

const reqString = {
    type: String,
    required: true,
}
const reqBool = {
    type: Boolean,
    default: true
}
const falseBool = {
    type: String,
    default: false
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
    antijoin: falseBool,
    welcome: reqBool,
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
    },
    ticketSettings: {
        type: {
            CategoryId: {
                type: String,
            },
            ChannelId: {
                type: String,
            },
            TranscriptsChannelId: {
                type: String,
            }
        },
        required: false,
        default: {
            CategoryId: "",
            ChannelId: "",
            TranscriptsChannelId: ""
        }
    }
}, {
    timestamps: true
})
export default model('settings', settingsSchema)