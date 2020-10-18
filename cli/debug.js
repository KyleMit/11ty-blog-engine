#!/usr/bin/env node

const { promises: fs } = require("fs")
const path = require("path")
const utils = require("../utils/utils")

const paths = utils.paths

const gitIgnoreLines = [
    "_site",
    ".cache",
    ".netlify",
    "node_modules",
    ".env",
    "package.json",
    "package-lock.json"
]

module.exports = main

async function main() {
    try {

        // run npm init -y
        // run npm i create-eleventy-blog
        // run npm link create-eleventy-blog
        // create/update .gitignore (if in git dir)
        // create/update .vscode/launch

        await utils.cmd(`npm init -y`);
        await utils.cmd(`npm install create-eleventy-blog`);
        await utils.cmd(`npm link create-eleventy-blog`); // todo - do we need a check before proceeding?

        await buildGitIgnore()

        await buildLaunchFile()

    } catch (err) {
        console.log({ err });
    }
}

async function buildGitIgnore() {
    // create paths and check if they exist
    let gitDirPath = path.join(paths.contentDir, "/.git/")
    let gitIgnorePath = path.join(paths.contentDir, "/.gitignore")
    let gitDirExists = await utils.checkDirExists(gitDirPath)
    let gitIgnoreExists = await utils.checkFileExists(gitIgnorePath)

    // if we're not in a git directory, don't worry about it
    if (!gitDirExists) { return }

    // create/modify git ignore
    if (gitIgnoreExists) {
        // modify if we need
        let gitignoreCurrent = await fs.readFile(gitIgnorePath, "utf8")
            // check if lines in gitignore
        let missingLines = gitIgnoreLines.filter(l => !gitignoreCurrent.includes(l))
        if (missingLines.length) {
            let appendLines = `# create eleventy blog \n` + missingLines.join("\n")
            await fs.writeFile(gitIgnorePath, gitignoreCurrent + appendLines, "utf8")
        }
    } else {
        // add gitignore
        await fs.writeFile(gitIgnorePath, gitIgnoreLines.join("\n"), "utf8")
    }

}

async function buildLaunchFile() {
    // create paths and check if they exist
    let launchFile = path.join(paths.contentDir, "/.vscode/launch.json")
    let launchFileExists = await utils.checkDirExists(launchFile)

    if (!launchFileExists) {
        let launchDir = path.dirname(launchFile)
        let launchContents = JSON.stringify(launchConfig, null, 2)

        await fs.mkdir(launchDir, { recursive: true })
        await fs.writeFile(launchFile, launchContents, "utf8")

    } else {
        // if it already exists, make sure we have a config setup
        let curLaunchContents = await utils.readJson(launchFile)
        let launchProgram = launchConfig.configurations[0].program
        let launchHasProgram = curLaunchContents.configurations.includes(c => c.program === launchProgram)

        if (!launchHasProgram) {
            // let's update it
            curLaunchContents.configurations.push(launchConfig.configurations[0])

            let newLaunchContents = JSON.stringify(curLaunchContents, null, 2)

            await fs.writeFile(launchFile, newLaunchContents, "utf8")
        }
    }

}


const launchConfig = {
    "version": "0.2.0",
    "configurations": [{
        "type": "node",
        "request": "launch",
        "name": "CLI - Sub Command",
        "program": "${workspaceFolder}/node_modules/create-eleventy-blog/cli/_cli.js",
        "args": ["build"],
        "runtimeArgs": [
            "--preserve-symlinks"
        ],
        "skipFiles": [
            "<node_internals>/**"
        ]
    }]
}
