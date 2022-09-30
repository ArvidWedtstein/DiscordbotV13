import profileSchema from '../schemas/profileSchema';
import Client from '../Client';
import { ColorResolvable } from 'discord.js';
import * as gradient from 'gradient-string';
const coinsCache: any = {}

// This function adds coins to the users profile
export const addCoins = (async (guildId: any, userId: any, coins: number) => {
    console.log(`${gradient.morning(`〔Economy Event〕`)}Add ${gradient.summer(`${userId}`)}: ${gradient.rainbow(`${coins}`)}`);

    const result = await profileSchema.findOneAndUpdate({
        guildId,
        userId
    }, {
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

    coinsCache[`${guildId}-${userId}`] = result.coins

    return result.coins
});

// This function sets the users coins to a specific value
export const setCoins = (async (guildId: any, userId: any, coins: number) => {
    console.log(`${gradient.morning(`〔Economy Event〕`)}Set ${gradient.summer(`${userId}`)}: ${gradient.rainbow(`${coins}`)}`);

    const result = await profileSchema.findOneAndUpdate({
        guildId,
        userId
    }, {
        $set: {
            coins
        }
    }, {
        upsert: true,
    })


    coinsCache[`${guildId}-${userId}`] = result.coins

    return result.coins
});

// This function gets the users coins
export const getCoins = (async (guildId: string, userId: any) => {
    console.log(`${gradient.morning(`〔Economy Event〕`)}Get ${gradient.summer(`${userId}`)}`);
    
    const cachedValue = coinsCache[`${guildId}-${userId}`]
    if (cachedValue) {
        return cachedValue
    }
    

    let result = await profileSchema.findOne({
        guildId,
        userId
    })

    
    if (!result) {
        result = await new profileSchema({
            guildId,
            userId,
            coins: 0
        }).save()
    }
    let coins = result.coins;

    coinsCache[`${guildId}-${userId}`] = coins

    return coins 
})

// This function gets the color a user has set in their profile
export const getColor = (async (guildId: any, userId: any) => {
    const result = await profileSchema.findOne({
        guildId,
        userId
    })

    let color: ColorResolvable = '#ff4300'
    let color2: ColorResolvable = "Aqua";
    if (result) {
        color2 = result.color
    } else if (!result) {
        await new profileSchema({
            guildId,
            userId,
            color
        }).save()
        color2 = '#ff4300'
    }

    return color2
})

