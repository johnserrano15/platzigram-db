'use strict'

const r = require('rethinkdb')
const co = require('co')
// sobre escribimos la promise que biene nativamente por js
const Promise = require("bluebird");

const defaults = {
  host: 'localhost',
  port: 28015,
  db: 'platzigram'
}

class Db {
  constructor (options) {
    options = options || {}
    this.host = options.host || defaults.host
    this.port = options.port || defaults.port
    this.db = options.db || defaults.db
  }

  connect (callback) {
    this.connection = r.connect({
      host: this.host,
      port: this.port
    })

    let db = this.db // Name database
    let connection = this.connection // Conexion como tal 

    // esto es una function generadora por el *
    // Setup me va a guardar una promise
    let setup = co.wrap(function * () {
      let conn = yield connection
      // yield me recuelve la promesa que em devuelve r.dbList....
      let dbList = yield r.dbList().run(conn)
      // Si no existe la database es igual a -1
      if (dbList.indexOf(db) === -1) {
        // entonces yield resuelve la promesa y la ejecucion del código va esperar a que esa promesa se resuelva.
        yield r.dbCreate(db).run(conn)
      }

      let dbTables = yield r.db(db).tableList().run(conn)
      if (dbTables.indexOf('images') === -1) {
        yield r.db(db).tableCreate('images').run(conn)
      }
      // yield pausa la ejecucion del código recordar
      if (dbTables.indexOf('users') === -1) {
        yield r.db(db).tableCreate('users').run(conn)
      }

      return conn
    })
    // vamos a devolver la promesa resuelva de setup
    // Si no me pasan callbac devolvemos la promesa
    return Promise.resolve(setup()).asCallback(callback)
  }
}

module.exports = Db
