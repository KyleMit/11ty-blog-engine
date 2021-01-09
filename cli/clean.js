#!/usr/bin/env node

const { promises: fs } = require("fs")
const path = require("path")
const utils = require("./utils")

const paths = utils.paths

module.exports = main

async function main(options) {
  try {
    // clean content
    if (["content", "both"].includes(options.target)) {
      // cleanup previous site builds
      await utils.removeDir(paths.contentSitePath)

      // cleanup debug
      let packagePath = path.join(paths.contentDir, "package.json")
      let packageLockPath = path.join(paths.contentDir, "package-lock.json")
      let launchPath = path.join(paths.contentDir, ".vscode/launch.json")
      await fs.unlink(packagePath)
      await fs.unlink(packageLockPath)
      await fs.unlink(launchPath)

      let nodeModulesDir = path.join(paths.contentDir, "node_modules")
      let cacheDir = path.join(paths.contentDir, ".cache")
      await utils.removeDir(nodeModulesDir, cacheDir)
    }

    // clean up engine files
    if (["engine", "both"].includes(options.target)) {
      // if we still have a temp folder, clean that up
      if (await utils.checkDirExists(paths.engineTempPath)) {
        // remove src and replace with temp
        await utils.removeDir(paths.engineSrcPath)
        await fs.rename(paths.engineTempPath, paths.engineSrcPath)
      }
      // cleanup previous site builds
      await utils.removeDir(paths.engineSitePath)
    }
  } catch (err) {
    console.log({ err })
  }
}
