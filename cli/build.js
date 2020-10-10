#!/usr/bin/env node

const { promises: fs } = require("fs")
const utils = require("../utils/utils")
const path = require("path")

const FOLDERS = {
    site: "_site",
    src: "src",
    temp: "temp",
    assets: "assets",
    config: "config.json",
    data: "data"
}

const CONTENT_TYPES = [
    "acronyms",
    "assets",
    "drafts",
    "notes",
    "pages",
    "posts",
    "slides",
    "samples"
]

module.exports = main

async function main() {
    try {

        // get config
        let objConfig = await utils.getConfig()

        // get paths
        let paths = getPaths()

        // cleanup local temp & site
        await removeDir(paths.engineTempPath, paths.engineSitePath, paths.contentSitePath)

        // copy engine src into temp
        await copyDir(paths.engineSrcPath, paths.engineTempPath)

        // copy content types into temp
        for (let dir of CONTENT_TYPES) {
            let contentFolder = path.join(paths.contentDir, dir)
            let engineTempFolder = path.join(paths.engineTempPath, dir)
            await copyDir(contentFolder, engineTempFolder)
        }

        // save config in data
        await writeJson(paths.engineTempDataConfigPath, objConfig)


        // change working directory, run 11ty, change back
        process.chdir(paths.engineDir);
        await utils.cmd(`npx @11ty/eleventy`);
        process.chdir(paths.contentDir);



        // move _site from engine to content
        await copyDir(paths.engineSitePath, paths.contentSitePath)


        // // cleanup local temp & site
        // await removeDir(paths.engineTempPath, paths.engineSitePath)



    } catch (err) {
        console.log({ err });
    }

}

function getPaths() {
    // get directories
    let { contentDir, engineDir } = utils.directories

    let contentSitePath = path.join(contentDir, FOLDERS.site)

    let engineSrcPath = path.join(engineDir, FOLDERS.src)
    let engineTempPath = path.join(engineDir, FOLDERS.temp)
    let engineTempDataPath = path.join(engineTempPath, FOLDERS.data)
    let engineTempDataConfigPath = path.join(engineTempDataPath, FOLDERS.config)
    let engineSitePath = path.join(engineDir, FOLDERS.site)


    let output = { contentDir, contentSitePath, engineDir, engineSrcPath, engineTempPath, engineTempDataPath, engineTempDataConfigPath, engineSitePath }
    return output
}

async function removeDir(...paths) {
    await Promise.all(paths.map(async(p) => {
        fs.rmdir(p, { recursive: true });
    }));
}

async function writeJson(filePath, obj) {
    let content = JSON.stringify(obj, null, 2)
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8')
}



async function copyDir(src, dest) {
    if (!(await checkDirExists(src))) { return }
    await fs.mkdir(dest, { recursive: true });
    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        entry.isDirectory() ?
            await copyDir(srcPath, destPath) :
            await fs.copyFile(srcPath, destPath);
    }
}

async function checkDirExists(dir) {
    try {
        let stat = await fs.lstat(dir)
        return stat.isDirectory()
    } catch (error) {
        return false;
    }
}