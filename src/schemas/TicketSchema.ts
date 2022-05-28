import { Schema, model, models } from "mongoose"
const reqString = {
    type: String,
    required: true
}

const ticketSchema = new Schema({
    guildId: reqString,
    userId: reqString,
    TicketId: reqString,
    ChannelId: reqString,
    Closed: {
        type: Boolean,
        default: false,
        required: false
    },
    Locked: {
        type: Boolean,
        default: false,
        required: false
    },
    Type: {
        type: String,
        enum: ["userticket", "bugticket", "otherticket"],
        required: true
    }
})
const name: string = 'Tickets'
export default models[name] || model(name, ticketSchema)