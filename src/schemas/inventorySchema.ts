
import mongoose from 'mongoose';

const reqString = {
    type: String,
    required: true,
}
const item = {
    name: '',
    icon: '',
    amount: 1
};

const inventorySchema = new mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    items: {
        type: [Object],
        required: true,
    },
    //slots: reqNumber
})
const name: string = 'inventory'
export default mongoose.models[name] || mongoose.model(name, inventorySchema)