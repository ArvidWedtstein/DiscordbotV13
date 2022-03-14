import { Schema, model } from "mongoose"

const reqString = {
    type: String,
    required: true
}

const pollSchema = new Schema({
    pollId: reqString,
    messageId: reqString,
    guildId: reqString,
    question: reqString,
    expires: {
        type: Date,
        required: false,
    },
    current: {
        type: Boolean,
        required: true,
    },
    answers: {
        type: Object,
        required: false
    }
}, {
    timestamps: true
})

export default model('polls', pollSchema);
