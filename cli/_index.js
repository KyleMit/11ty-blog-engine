const build = require("./build")
const clean = require("./clean")
const lint = require("./lint")
const create = require("./create")
const debug = require("./debug")

// barrel rollup
module.exports = {
    build,
    clean,
    create,
    lint,
    debug
}