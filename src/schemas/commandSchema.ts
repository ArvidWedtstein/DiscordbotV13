import mongoose from 'mongoose'

const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
    default: 15
}


const commandSchema = new mongoose.Schema({
    guildId: reqString,
    commands: {
        type: [Object],
        required: true,
    },
})
export default mongoose.model('commands', commandSchema)