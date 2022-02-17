const { getAge } = require('../utils/helpers.js')

describe('[helpers.js]', () => {

    it('test getAge()', () => {
        const res = getAge('aa')
        const check = isNaN(res)
        expect(check).toBe(true)
    })

    it('test getAge()', () => {
        const age = getAge('1996-04-15')
        expect(age).toBe(25)
    })
})
