import { addItem } from '../../src/Functions/UserInventory';
// const { addItem } = require('../../src/Functions/UserInventory');

test("Add Item to A user's inventory", () => {
    expect(addItem('987654321987654321', '123456789123456789', 'test', 1)).toMatchObject({});
})


// describe('Add Item to a user', () => {
//     let item = 'apple';
//     let amount = 2;
//     let userId = '123456789123456789';
//     let guildId = '987654321987654321';


//     it('item should not be a number', () => {
//         expect(item).not.toBeNull()
//     })
//     it('amount should be valid', () => {
//         expect(amount).toBeGreaterThan(0);
//     })
// })