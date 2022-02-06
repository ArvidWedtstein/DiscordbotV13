import mongoose from 'mongoose';
const reqNumber = {
    type: Number,
    required: true,
    default: 0
}
const reqString = {
    type: String,
    required: true
}
const reqDate = {
    type: Date,
    required: true
}
const messageCountSchema = new mongoose.Schema({
    userId: reqString,
    guildId: reqString,
    messageCount: reqNumber,
})

export default mongoose.model('message-counts', messageCountSchema)