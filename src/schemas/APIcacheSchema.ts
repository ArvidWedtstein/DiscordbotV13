import { Schema, model, models } from "mongoose"

const reqString = {
    type: String,
    required: true,
}

const BrawlhallaAPICache = new Schema({
    userId: reqString,
    data: {
        type: Object,
        required: true,
    }
}, {
    timestamps: true,
    expires: 3600 * 24 * 7
})
const name: string = "APIcache"
export default models[name] || model(name, BrawlhallaAPICache)