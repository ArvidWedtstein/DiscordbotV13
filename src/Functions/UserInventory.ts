import items from '../items.json'
import profileSchema from '../schemas/profileSchema';

const itemsCache = {}

const inventoryslotsCache = {}
export const addItem = (async (guildId: any, userId: any, itemname: string, amount: number) => {
    const insertItems = []
    for (let i = 0; i < amount; i++) {
        insertItems.push({name: itemname,})
    }
    const result = await profileSchema.findOneAndUpdate({
        guildId,
        userId,
    }, {
        $push: {
            items: {
                $each: items
            }
        },
    }, {
        upsert: true,
    }).catch((err: any) => {
        console.log(err)
    })

    console.log('Running findOneAndUpdate(item)')

    return result.items 
})
export const removeItem = (async (guildId: any, userId: any, itemname: any, itemicon: any, amount: any) => {

    const item = {
        name: itemname
    }

    for (let i = 0; i < amount; i++) {
        const result = await profileSchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            $pull: {
                items: item
            }
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })
    }
    return 
})
export const giveItem = (async (guildId: any, userId: any, itemname: any, amount: any, senderId: any) => {

    const item = {
        name: itemname
    }
    
    let items = Array(amount).fill(item)
    // Remove item from senders inventory
    for (let i = 0; i < amount; i++) {

        const result = await profileSchema.findOneAndUpdate({
            guildId,
            userId: senderId,
        }, {
            $pull: {
                items: item
            }
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })
    }
    
    // Add item to receivers inventory
    const result = await profileSchema.findOneAndUpdate({
        guildId,
        userId,
    }, {
        // $push: {
        //     items: item
        // }
        $push: {
            items: { $each: items }
        }
    }, {
        upsert: true,
    }).catch((err: any) => {
        console.log(err)
    })
    return 
})
export const getItems = (async (guildId: any, userId: any) => {

    const cachedValue = ""
    if (cachedValue) {
        return cachedValue
    }
    console.log('Running findOne(getitems)')

    const result = await profileSchema.findOne({
        guildId,
        userId
    })

    let items = {};
    
    if (result) {
        items = result.items
    } else {
        items = ''
    }
    
    //itemsCache[`${guildId}-${userId}`] = items
    
    return items
    
})
