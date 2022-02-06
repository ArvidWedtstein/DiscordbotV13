import mongoose from 'mongoose'
const reqString = {
    type: String,
    required: true
}

const languageSchema = new mongoose.Schema({
    guildId: reqString,
    language: reqString,
})

export default mongoose.model('languages', languageSchema);