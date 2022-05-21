import items from '../items.json'
import profileSchema from '../schemas/profileSchema';

const itemsCache = {}

const inventoryslotsCache = {}
export async function addItem (guildId: any, userId: any, itemname: string, amount: number) {
    const items = []
    for (let i = 0; i < amount; i++) {
        items.push({
            name: itemname,
        })
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

    return result 
}
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

        if (!result) {
            await new profileSchema({
                guildId,
                userId
            }).save()
        } 
    }
    return 
})
export const giveItem = (async (guildId: any, userId2: any, itemname: any, amount: any, authorId: any) => {

    const item = {
        name: itemname
    }
    
    // Remove item from senders inventory
    for (let i = 0; i < amount; i++) {
        let userId = authorId;

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

        if (!result) {
            await new profileSchema({
                guildId,
                userId
            }).save()
        } 
    }
    
    // Add item to receivers inventory
    for (let i = 0; i < amount; i++) {
        let userId = userId2;
        const result = await profileSchema.findOneAndUpdate({
            guildId,
            userId,
        }, {
            $push: {
                items: item
            }
        }, {
            upsert: true,
        }).catch((err: any) => {
            console.log(err)
        })
        if (!result) {
            await new profileSchema({
                guildId,
                userId,
                items: item
            }).save()
        } 
    }
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
        console.log('Inserting a document')
        await new profileSchema({
            guildId,
            userId,
            //items
        }).save()
        items = ''
    }
    
    //itemsCache[`${guildId}-${userId}`] = items
    
    return items
    
})
