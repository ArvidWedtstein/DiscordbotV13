import { Schema, model, models } from "mongoose"

const reqString = {
    type: String,
    required: true,
}
interface APICache {
    userId: string;
    data: Object;
    createdAt: Date;
}
const NasaAPICache = new Schema<APICache>({
    userId: {
        type: String,
        required: false
    },
    data: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        // index: {
        //     expireAfterSeconds: 86400
        // }
    }
}, {
    timestamps: true,
    expires: 86400,
    expireAfterSeconds: 86400
})
// NasaAPICache.index({ createdAt: 1 }, { expireAfterSeconds: 60 })
const name: string = "24hAPIcache"
export default models[name] || model(name, NasaAPICache)