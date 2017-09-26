'use strict'

const test = require('ava')
const uuid = require('uuid-base62')
const r = require('rethinkdb')
const Db = require('../')
const utils = require('../lib/utils')
const fixtures = require('./fixtures')

test.beforeEach('setup database', async t => {
  const dbName = `platzigram_${uuid.v4()}`
  const db = new Db({ db: dbName })
  await db.connect()
  t.context.db = db
  t.context.dbName = dbName
  t.true(db.connected, 'Should be connected')
})

test.afterEach.always('cleanup database', async t => {
  let db = t.context.db
  let dbName = t.context.dbName
  await db.disconnect()
  t.false(db.connected, 'Should be disconnect')

  let conn = await r.connect({})
  await r.dbDrop(dbName).run(conn)
})

test('save image', async t => {
  let db = t.context.db
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
  let db = t.context.db
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

test('get image', async t => {
  let db = t.context.db
  // preguntamos que exista una funcion con nmae getImage
  t.is(typeof db.getImage, 'function', 'getImage is a function')
  // Traemos la imagen
  let image = fixtures.getImage()
  // guardamos la imagen
  let created = await db.saveImage(image)
  // le pasamos el id public a la function getImage
  let result = await db.getImage(created.public_id)
  // validamos que sea igul lo que se va a crear a lo que devulve el getimage
  t.deepEqual(created, result)
})

test('list all images', async t => {
  let db = t.context.db
  // Traemos la imagen
  let images = fixtures.getImages(3)
  // Creamos un array
  let saveImages = images.map(img => db.saveImage(img))
  // console.log(saveImages)
  // guardamos las images
  let created = await Promise.all(saveImages)
  // console.log(created)
  let result = await db.getImages()

  t.is(created.length, result.length)
})

test('save user', async t => {
  let db = t.context.db

  t.is(typeof db.saveUser, 'function', 'saveUser is a function')

  let user = fixtures.getUser()
  let plainPassword = user.password
  let created = await db.saveUser(user)

  t.is(user.username, created.username)
  t.is(user.email, created.email)
  t.is(user.name, created.name)
  t.is(utils.encrypt(plainPassword), created.password)
  t.is(typeof created.id, 'string')
  t.truthy(created.createdAt)
})

test('get user', async t => {
  let db = t.context.db

  t.is(typeof db.getUser, 'function', 'getUser is a function')

  let user = fixtures.getUser()
  let created = await db.saveUser(user)
  let result = await db.getUser(user.username)

  t.deepEqual(created, result)
})

test('authenticate user', async t => {
  let db = t.context.db

  t.is(typeof db.authenticate, 'function', 'authenticate is a function')

  let user = fixtures.getUser()
  let plainPassword = user.password
  await db.saveUser(user)

  let success = await db.authenticate(user.username, plainPassword)
  t.true(success)

  let fail = await db.authenticate(user.username, 'holis')
  t.false(fail)
})
