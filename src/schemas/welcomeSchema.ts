import mongoose from 'mongoose';


const reqString = {
    type: String,
    required: true
}
const welcomeSchema = new mongoose.Schema({
    guildId: reqString,
    channelId: reqString,
    text: reqString
})

export default mongoose.model('welcome-channels', welcomeSchema)