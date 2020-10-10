#!/usr/bin/env node

const { promises: fs } = require("fs")
const { promisify } = require('util');
const path = require("path")
const cp = require('child_process')
const exec = promisify(cp.exec);


main()

async function main() {
    try {
        let config = {
            paths: {
                siteDir: "_site",
                content: "src",
                assets: "assets"
            },
            contentTypes: [
                "drafts",
                "posts",
                "presentations"
            ]
        }

        let curDir = process.cwd()
        let binDir = __dirname
        console.log({ curDir, binDir })

        let curSite = path.join(curDir, config.paths.siteDir)
        let binSite = path.join(binDir, config.paths.siteDir)
        let binContent = path.join(binDir, config.paths.content)
        let curAssets = path.join(curDir, config.paths.assets)
        let binAssets = path.join(binDir, config.paths.assets)

        // clear site folders and temp content dir
        await fs.rmdir(curSite, { recursive: true });
        await fs.rmdir(binSite, { recursive: true });
        await fs.rmdir(binContent, { recursive: true });
        await fs.rmdir(binAssets, { recursive: true });

        // generate output directory shell
        await fs.mkdir(binContent, { recursive: true });

        // copy content from cur dir
        for (let dir of config.contentTypes) {
            let curContentDir = path.join(curDir, dir)
            let binContentDir = path.join(binContent, dir)
            await copyDir(curContentDir, binContentDir)
        }

        // copy assets
        await copyDir(curAssets, binAssets)

        // change working directory to bin dir
        process.chdir(binDir);

        // run eleventy in bin dir
        await cmd(`eleventy ${process.argv.slice(2).join(" ")}`);


        // move _site from binDir to curDir
        await copyDir(binSite, curSite)

        // delete temp content and site
        await fs.rmdir(binSite, { recursive: true });
        await fs.rmdir(binContent, { recursive: true });
        await fs.rmdir(binAssets, { recursive: true });

    } catch (err) {
        console.log({ err });
    }

}


async function cmd(text) {
    const { stdout, stderr } = await exec(text);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
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