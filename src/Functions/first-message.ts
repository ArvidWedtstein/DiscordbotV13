import { Client, Message } from "discord.js"

const addReactions = (message: Message, reactions: any) => {
    if (reactions[0]) {
        message.react(reactions[0])
        reactions.shift()
        if (reactions.length > 0) {
            setTimeout(() => addReactions(message, reactions), 750)
        }
    }   
}
export default async (client: Client, id: any, text: any, reactions = [], menu: any) => {
    const channel = await client.channels.fetch(id)
    menu = menu || ''
    if (!channel?.isTextBased()) return
    channel?.messages?.fetch().then((messages) => {
        
        if (messages.size === 0) {
            channel.send({ content: text, components: [menu] }).then((message) => {
                addReactions(message, reactions)
            })
        } else {
            for (const message of messages) {
                if (message[1].author.id != client.user?.id) return
                message[1].edit(text)
                addReactions(message[1], reactions)
            }
        }
    }) 
}

