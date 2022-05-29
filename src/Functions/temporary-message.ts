import { Message } from "discord.js"

export default (channel: any, text: any, duration = -1) => {
    channel.send(text).then((message: Message) => {
        if (duration === -1) {
            return
        }

        setTimeout(() => {
            let id = channel.messages.fetch(message.id)
            if (message || id) {
                if (message.deletable) message.delete()
            } else {
                return
            }
            
        }, 1000 * duration)
    })
}