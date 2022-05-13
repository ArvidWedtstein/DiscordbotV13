import { Schema, model } from "mongoose"

const reqString = {
    type: String,
    required: true
}
const guessTheWordRankedSchema = new Schema({
    guildId: reqString,
    text: {
        type: String,
        required: true,
        default: 'Information'
    },
    rules: {
        type: Object,
        required: true
    },
    verifyrole: {
        type: String,
        required: false
    }
})

export default model('rules', guessTheWordRankedSchema)