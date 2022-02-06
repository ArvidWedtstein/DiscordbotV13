const items = require('./items');
const inventorySchema = require('../schemas/inventorySchema')

const itemsCache = {}

const inventoryslotsCache = {}
module.exports = (client: any) => {}
export async function addItem (guildId: any, userId: any, itemname: any, amount: any) {
    const item = {
        name: itemname,
    }
    for (let i = 0; i < amount; i++) {
        const result = await inventorySchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            guildId,
            userId,
            $push: {
                items: item
            },
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })
    }
    console.log('Running findOneAndUpdate(item)')
    
    
    return
            
}
export async function removeItem (guildId: any, userId: any, itemname: any, itemicon: any, amount: any) {
    //console.log('Running findOneAndUpdate(item)')
    const item = {
        name: itemname
    }

    for (let i = 0; i < amount; i++) {
        const result = await inventorySchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            guildId,
            userId,
            $pull: {
                items: item
            }
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })
        if (!result) {
            await new inventorySchema({
                guildId,
                userId
            }).save()
        } 
    }
    return 
}
export async function giveItem (guildId: any, userId2: any, itemname: any, amount: any, authorId: any) {
    //console.log('Running findOneAndUpdate(item)')
    const item = {
        name: itemname
    }
    
    // Remove item from senders inventory
    console.log(amount);
    for (let i = 0; i < amount; i++) {
        let userId = authorId;
        const result = await inventorySchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            guildId,
            userId,
            $pull: {
                items: item
            }
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })
        if (!result) {
            await new inventorySchema({
                guildId,
                userId
            }).save()
        } 
    }
    
    // Add item to receivers inventory
    for (let i = 0; i < amount; i++) {
        let userId = userId2;
        const result = await inventorySchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            guildId,
            userId,
            $push: {
                items: item
            }
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })
        console.log(result.items)
        if (!result) {
            await new inventorySchema({
                guildId,
                userId,
                items: item
            }).save()
        } 
    }
    return 
}
export async function getItems (guildId?: any, userId?: string) {
    // const cachedValue = itemsCache[`${guildId}-${userId}`];
    const cachedValue = ""
    if (cachedValue) {
        return cachedValue
    }
    console.log('Running findOne(getitems)')

    const result = await inventorySchema.findOne({
        guildId,
        userId
    })
    //console.log(result)

    let items = {};
    
    if (result) {
        items = result.items
    } else {
        console.log('Inserting a document')
        await new inventorySchema({
            guildId,
            userId,
            //items
        }).save()
        items = ''
    }
    
    //itemsCache[`${guildId}-${userId}`] = items
    
    return items
    
}
