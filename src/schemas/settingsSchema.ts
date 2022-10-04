import { Schema, model, models } from "mongoose"

const reqString = {
    type: String,
    required: true,
}
const reqBool = {
    type: Boolean,
    default: true,
    required: false
}
const falseBool = {
    type: String,
    default: false,
    required: false
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
        default: 'ErlingCoin',
        required: false
    },
    antijoin: falseBool,
    welcome: reqBool,
    birthday: falseBool,
    iconcolor: {
        type: String,
        default: "purple",
        required: false
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
        required: false,
        default: 'english'
    },
    ticketSettings: {
        type: {
            CategoryId: String,
            ChannelId: String
        },
        required: false,
        default: {
            CategoryId: "",
            ChannelId: ""
        }
    }
}, {
    timestamps: true
})

const name: string = 'settings'
export default models[name] || model(name, settingsSchema)
