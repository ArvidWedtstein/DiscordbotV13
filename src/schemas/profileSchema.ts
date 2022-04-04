import { Schema, model } from "mongoose"

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
    joinedDate: {
        type: Date,
        required: false
    }
})

export default model('profiles', profileSchema)