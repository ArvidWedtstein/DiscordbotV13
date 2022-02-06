import mongoose from 'mongoose';

const swearSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    swear: {
        type: [Object],
        required: true,
    }
})
export default mongoose.model('swear', swearSchema)