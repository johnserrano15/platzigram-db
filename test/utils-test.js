'use strict'

const test = require('ava')
// un test que solo pasa sin validar nada 
test('this, should pass', t => {
  t.pass()
})

// Un test que da error sin validar
/* test('this should fail', t => {
  t.fail()
}) */

// un test que siendo async 
test('it should support async/await', async t => {
  let p = Promise.resolve(43)
  let secret = await p
  t.is(secret, 43)
})
