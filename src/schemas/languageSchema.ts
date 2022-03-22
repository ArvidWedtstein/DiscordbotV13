import { Schema, model } from "mongoose"
const reqString = {
    type: String,
    required: true
}

const languageSchema = new Schema({
    guildId: reqString,
    language: reqString,
})

export default model('languages', languageSchema);