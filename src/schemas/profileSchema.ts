import mongoose from 'mongoose';

const reqString = {
    type: String,
    required: true,
}
const profileSchema = new mongoose.Schema({ 
    guildId: reqString,
    userId: reqString,
    coins: {
        type: Number,
        default: 0,
    },
    xp: {
        type: Number,
        default: 0,
    },
    level: {
        type: Number,
        default: 10,
    },
    birthday: {
        type: String,
        default: '1/1',
    },
    joinedDate: {
        type: Date,
        required: false
    }
})

export default mongoose.model('profiles', profileSchema)