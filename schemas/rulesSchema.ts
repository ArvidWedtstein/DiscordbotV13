import mongoose from 'mongoose';

const reqString = {
    type: String,
    required: true
}
const welcomeSchema = new mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
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

export default mongoose.model('rules', welcomeSchema)