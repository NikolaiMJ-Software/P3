//install the extension Vitest snippets so you can use the commented shortcuts

//to execute your tests run the command "npm run test (or just npm t)" in the terminal 
//you can also run "npm run test:ui" to open the Vitest UI in your browse

// IV to import vitest
import { it, expect, describe } from 'vitest'

//type d for describe
describe('Sample Test Suite', () => {
// i for test case
it('should', () => {
    //assertion
    expect(1 + 1).toBe(2)
})

})