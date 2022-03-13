import { Schema, model } from "mongoose"

const reqString = {
    type: String,
    required: true
}

const muteSchema = new Schema({
    userId: reqString,
    guildId: reqString,
    reason: reqString,
    staffId: reqString,
    staffTag: reqString,
    expires: {
        type: Date,
        required: true,
    },
    current: {
        type: Boolean,
        required: true,
    },
}, {
    timestamps: true
})

export default model('mutes', muteSchema);
