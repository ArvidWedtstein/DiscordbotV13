import { Schema, model, models } from "mongoose"

const reqString = {
    type: String,
    required: true,
}

const commandSchema = new Schema({
    guildId: reqString,
    commands: {
        type: [Object],
        required: true,
    },
})
const name: string = "commands"
export default models[name] || model(name, commandSchema)