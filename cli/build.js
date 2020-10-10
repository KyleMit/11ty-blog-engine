#!/usr/bin/env node

const { promises: fs } = require("fs")
const utils = require("../utils/utils")
const path = require("path")



module.exports = main

async function main() {
    try {
        let config = {
            paths: {
                siteDir: "_site",
                content: "src",
                assets: "assets",
                config: ".config",
                data: "data"
            },
            contentTypes: [
                "drafts",
                "posts",
                "presentations"
            ]
        }
        let objConfig = await utils.getConfig()
        console.log({ objConfig })

        let { contentDir, engineDir } = utils.directories
        console.log({ contentDir, engineDir })

        let curSite = path.join(contentDir, config.paths.siteDir)
        let binSite = path.join(engineDir, config.paths.siteDir)
        let curAssets = path.join(contentDir, config.paths.assets)
        let binAssets = path.join(engineDir, config.paths.assets)
        let curConfig = path.join(contentDir, config.paths.config)
        let binData = path.join(engineDir, config.paths.data)

        // clear site folders and temp content dir
        await fs.rmdir(curSite, { recursive: true });
        await fs.rmdir(binSite, { recursive: true });
        await fs.rmdir(binAssets, { recursive: true });


        // copy content from cur dir
        for (let dir of config.contentTypes) {
            let curContentDir = path.join(contentDir, dir)
            let binContentDir = path.join(engineDir, dir)
            await copyDir(curContentDir, binContentDir)
        }

        // copy assets & data
        await copyDir(curAssets, binAssets)
        await copyDir(curConfig, binData)


        // change working directory to bin dir
        process.chdir(engineDir);

        // run eleventy in bin dir
        await utils.cmd(`npx @11ty/eleventy ${process.argv.slice(2).join(" ")}`);

        process.chdir(contentDir);

        // move _site from binDir to curDir
        await copyDir(binSite, curSite)



        // delete temp content and site
        await fs.rmdir(binSite, { recursive: true });
        await fs.rmdir(binAssets, { recursive: true });
        await fs.rmdir(binData, { recursive: true });

        for (let dir of config.contentTypes) {
            let binContentDir = path.join(engineDir, dir)
            await fs.rmdir(binContentDir, { recursive: true });
        }


    } catch (err) {
        console.log({ err });
    }

}



async function copyDir(src, dest) {
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