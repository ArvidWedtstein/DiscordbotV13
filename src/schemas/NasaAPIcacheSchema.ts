import { Schema, model, models } from "mongoose"

const reqString = {
    type: String,
    required: true,
}

const NasaAPICache = new Schema({
    type: reqString,
    data: {
        type: Object,
        required: true,
    }
}, {
    timestamps: true,
    expires: 3600 * 24
})
const name: string = "NasaAPIcache"
export default models[name] || model(name, NasaAPICache)