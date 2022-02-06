import mongoose from 'mongoose';

const warnSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    warnings: {
        type: [Object],
        required: true,
    }
})

export default mongoose.model('warnings', warnSchema)