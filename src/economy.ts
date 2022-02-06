import profileSchema from './schemas/profileSchema';
import Client from './Client';
import { ColorResolvable } from 'discord.js';
const coinsCache: any = {}

export const addCoins = (async (guildId: any, userId: any, coins: number) => {
    console.log(`Execute findOneAndUpdate(coins)`)

    const result = await profileSchema.findOneAndUpdate({
        guildId,
        userId
    }, {
        guildId,
        userId,
        $inc: {
            coins
        }
    }, {
        upsert: true
    }).catch((err: any) => {
        console.log(err)
    })
    if (!result) {
        let coins = 0;
        await new profileSchema({
            guildId,
            userId,
            coins
        }).save()
    }
    //console.log('RESULT:', result)

    coinsCache[`${guildId}-${userId}`] = result.coins

    return result.coins
});

export const setCoins = (async (guildId: any, userId: any, coins: number) => {
    console.log(`Execute setCoins(${coins})`)

    const result = await profileSchema.findOneAndUpdate({
        guildId,
        userId
    }, {
        guildId,
        userId,
        $set: {
            coins
        }
    }, {
        upsert: true,
        new: true,
    })


    coinsCache[`${guildId}-${userId}`] = result.coins

    return result.coins
});

export const getCoins = (async (guildId: any, userId: any) => {
    const cachedValue = coinsCache[`${guildId}-${userId}`]
    if (cachedValue) {
        return cachedValue
    }
    console.log('Running findOne("economy")')

    const result = await profileSchema.findOne({
        guildId,
        userId
    })
    //console.log(result)

    let coins = 0;
    if (result) {
        coins = result.coins
    } else {
        console.log('Inserting a document')
        await new profileSchema({
            guildId,
            userId,
            coins
        }).save()
    }

    coinsCache[`${guildId}-${userId}`] = coins

    return coins 
})
export const getColor = (async (guildId: any, userId: any) => {
    const result = await profileSchema.findOne({
        guildId,
        userId
    })

    let color: ColorResolvable = '#ff4300'
    let color2: ColorResolvable = "AQUA";
    if (result) {
        color2 = result.color
    } else {
        await new profileSchema({
            guildId,
            userId,
            color
        }).save()
        color2 = '#ff4300'
    }

    return color2
})

