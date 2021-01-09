const npm = require("npm")
const { promisify } = require("util")
const { resolve } = require("path")

module.exports = main

async function main() {
  let npmLoadAsync = promisify(npm.load)
  await npmLoadAsync({})
  let prefix = npm.get("prefix")
  let globalPath = resolve(process.execPath, "../../lib/node_modules")
  console.log(prefix, globalPath)
}
