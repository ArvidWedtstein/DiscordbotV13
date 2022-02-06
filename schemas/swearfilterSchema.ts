import mongoose from 'mongoose';
const swearfilterSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    swearwords: {
        type: [String],
        required: true,
    }
})

export default mongoose.model('swearwords', swearfilterSchema)