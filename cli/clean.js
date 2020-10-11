#!/usr/bin/env node

const { promises: fs } = require("fs")
const utils = require("../utils/utils")
let paths = utils.paths


module.exports = main

async function main() {
    try {

        // if we still have a temp folder, clean that up
        if (await utils.checkDirExists(paths.engineTempPath)) {
            // remove src and replace with temp
            await utils.removeDir(paths.engineSrcPath)
            await fs.rename(paths.engineTempPath, paths.engineSrcPath)
        }

        // cleanup previous site builds
        await utils.removeDir(paths.engineSitePath, paths.contentSitePath)


    } catch (err) {
        console.log({ err });
    }
}