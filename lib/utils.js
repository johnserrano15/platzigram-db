'use strict'

// Probar expresiones regulares http://regexr.com/

// como lleva e mismo nombre del valor se deja un solo valor en ver de clave: valor
// Gracias a ecm2015
const utils = {
  extractTags
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

module.exports = utils
