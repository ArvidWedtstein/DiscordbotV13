
const mongoose = require('mongoose')

const reqString = {
    type: String,
    required: true,
}
const reqNumber = {
    type: Number,
    required: true,
    default: 15
}
const item = {
    name: '',
    icon: '',
    amount: 1
}

const inventorySchema = mongoose.Schema({
    guildId: reqString,
    userId: reqString,
    items: {
        type: [Object],
        required: true,
    },
    //slots: reqNumber
})

export default mongoose.model('inventory', inventorySchema)