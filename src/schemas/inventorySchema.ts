
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

export default mongoose.model('inventory', inventorySchema)