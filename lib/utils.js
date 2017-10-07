'use strict'

// crypto vienen dentro del core de nodejs
const crypto = require('crypto')
// Probar expresiones regulares http://regexr.com/

// como lleva e mismo nombre del valor se deja un solo valor en ver de clave: valor
// Gracias a ecm2015
const utils = {
  extractTags,
  normalize,
  encrypt
}

function extractTags (text) {
// con doble igual validamos que si es null o undefined
  if (text == null) return []

  // con match le aplicamos la expresion regular al text
  let matches = text.match(/#(\w+)/g)

  // Si ay text pero no ay ningun match entonces es null
  if (matches === null) return []

  matches = matches.map(normalize)

  return matches
}

function normalize (text) {
  text = text.toLowerCase()
  text = text.replace(/#/g, '')
  return text
}

function encrypt (password) {
  // bastante seguro para guardar en databases
  let shasum = crypto.createHash('sha256')
  shasum.update(password)
  return shasum.digest('hex')
}

module.exports = utils
