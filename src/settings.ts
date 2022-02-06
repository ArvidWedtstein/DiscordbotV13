const settingsSchema = require('./schemas/settingsSchema')
const language = require('./language')


export const Settings = (async (message: any, category: string) => {
    const { guild } = message
    const guildId = guild.id
    let result = await settingsSchema.findOne({
        guildId
    })
    if (!result) {
        result = await new settingsSchema({
            guildId
        }).save()
    }
    const categories: any = {
        moderation: result.moderation,
        ticket: result.ticket,
        swearfilter: result.swearfilter,
        emotes: result.emotes,
        money: result.money,
        currency: result.currency,
        antijoin: result.antijoin,
        welcome: result.welcome
    }
    for (const key in categories) {
        if (category == key) {
            return categories[key];
        }
    }
});
export const Settingsguild = (async (guild: any, category: string) => {
    let guildId = guild
    if (Number.isNaN(guild)) {
        console.log('is not a number')
        guildId = guild.id
    }

    //if (!guildId) return
    let result = await settingsSchema.findOne({
        guildId
    })
    if (!result) {
        result = await new settingsSchema({
            guildId
        }).save()
    }
    const categories: any = {
        moderation: result.moderation,
        ticket: result.ticket,
        swearfilter: result.swearfilter,
        emotes: result.emotes,
        money: result.money,
        currency: result.currency,
        antijoin: result.antijoin,
        welcome: result.welcome
    }
    for (const key in categories) {
        if (category == key) {
            return categories[key]
        }
    }
})

