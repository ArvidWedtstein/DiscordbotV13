import { addItem } from '../../src/Functions/UserInventory';
// const { addItem } = require('../../src/Functions/UserInventory');

test("Add Item to A user's inventory", async () => {
    let guildId = '987654321987654321';
    let userId = '123456789123456789';
    let itemname = 'test';
    let amount = 1;

    // console.log(await addItem(guildId, userId, itemname, amount) == items)
    expect(await addItem(guildId, userId, itemname, amount)).toHaveLength(amount);
    
    expect(await addItem(guildId, userId, itemname, amount)).toEqual(
        expect.arrayContaining([
            expect.objectContaining({name: itemname}),
        ])
    );
})

// test("Remove Item from a user's inventory", async () => {
//     let guildId = '987654321987654321';
//     let userId = '123456789123456789';
//     let itemname = 'test';
//     let amount = 1;

//     // console.log(await addItem(guildId, userId, itemname, amount) == items)
//     expect(await addItem(guildId, userId, itemname, amount)).toHaveLength(amount);
    
//     expect(await addItem(guildId, userId, itemname, amount)).toEqual(
//         expect.arrayContaining([
//             expect.objectContaining({name: itemname}),
//         ])
//     );
// })

