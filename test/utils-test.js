'use strict'

const test = require('ava')
const utils = require('../lib/utils')

/*
// un test que solo pasa sin validar nada
test('this, should pass', t => {
  t.pass()
})

// Un test que da error sin validar
test('this should fail', t => {
  t.fail()
})

// un test que siendo async
test('it should support async/await', async t => {
  let p = Promise.resolve(43)
  let secret = await p
  t.is(secret, 43)
})

*/

// Estamos definiendo lo que yo quiero que me devuelva
test('extracting hashtags from text', t => {
  let tags = utils.extractTags('a #picture with tags #AwEsOmE #Platzi #AVA #100 ##yes')
  // deepEqual sirve para comparar objects o arrays
  t.deepEqual(tags, [
    'picture',
    'awesome',
    'platzi',
    'ava',
    '100',
    'yes'
  ])

  // Si el texto no tiene #
  tags = utils.extractTags('a picture with no tags')
  t.deepEqual(tags, [])
  // si no pasan nada ningun text
  tags = utils.extractTags()
  t.deepEqual(tags, [])

  tags = utils.extractTags(null)
  t.deepEqual(tags, [])
})

test('encrypt password', t => {
  let password = 'HolaMundo456'
  let encrypted = 'b375797b4c5776ae632518d918e816ca3628082df7408588feabe8a0165ff211'

  let result = utils.encrypt(password)
  t.is(result, encrypted)
})
