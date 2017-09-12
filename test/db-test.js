'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
const fixtures = require('./fixtures')

const dbName = `platzigram_${uuid.v4()}`
const db = new Db({ db: dbName })

test.before('setup database', async t => {
  await db.connect()
  t.true(db.connected, 'Should be connected')
})

test.after('disconnect database', async t => {
  await db.disconnect()
  t.false(db.connected, 'Should be disconnect')
})

test.after.always('cleanup database', async t => {
  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

test('save image', async t => {
  t.is(typeof db.saveImage, 'function', 'Save Image in function ')

  let image = fixtures.getImage()

  let created = await db.saveImage(image)
  // validamos que lo se esta pasando es lo mismo que ya se creo.
  t.is(created.description, image.description)
  t.is(created.url, image.url)
  t.is(created.likes, image.likes)
  t.is(created.liked, image.liked)
  t.deepEqual(created.tags, ['awesome', 'platzi'])
  t.is(created.user_id, image.user_id)
  t.is(typeof created.id, 'string')
  t.is(created.public_id, uuid.encode(created.id))
  // Fecha de creacion
  t.truthy(created.createdAt)
})

test('like image', async t => {
  // preguntamos que exista una funcion con nmae likeImage
  t.is(typeof db.likeImage, 'function', 'like images is a function')
  // Traemos la imagen
  let image = fixtures.getImage()
  // guardamos la imagen
  let created = await db.saveImage(image)
  // le pasamos el id public a la function likeImage
  let result = await db.likeImage(created.public_id)

  // validamos que el resultado si sea like
  t.true(result.liked)
  // Y que el liked aya aumentado a mas uno
  t.is(result.likes, image.likes + 1)
})
