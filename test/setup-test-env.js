
/**
 * This is used to set up the environment that's needed for most
 * of the unit tests for the project which includes babel transpilation
 * with babel-register, polyfilling, and initializing the DOM with jsdom
 */
const browserEnv = require('browser-env')
// require('babel-register')
// require('babel-polyfill')
// global.document = require('jsdom').jsdom('<body></body>')
// global.window = document.defaultView
// global.navigator = window.navigator
// global.navigator = window.localStorage

browserEnv(['window', 'document', 'navigator', 'localStorage'])
