#!/usr/bin/env node

const { promises: fs } = require("fs")
const utils = require("../utils/utils")
const path = require("path")

const { ALL_TYPES, FILES } = require("../utils/consts")
const { description } = require("commander")

// get paths
let paths = utils.paths

module.exports = main

async function main(options) {
    try {
        // check that we have a user config
        if (!(await utils.checkConfigExists())) {
            console.log(`cannot perform build - must be called from a folder that has ${FILES.configInput}`)
            return;
        }

        // if we still have a temp folder, clean that up
        if (await utils.checkDirExists(paths.engineTempPath)) {
            // remove src and replace with temp
            await utils.removeDir(paths.engineSrcPath)
            await fs.rename(paths.engineTempPath, paths.engineSrcPath)
        }

        // cleanup previous site builds
        await utils.removeDir(paths.engineSitePath, paths.contentSitePath)

        // copy engine src into temp for safe keeping
        await utils.copyDir(paths.engineSrcPath, paths.engineTempPath)

        // copy engine types into src
        await utils.copyDir(paths.engineTypesPath, paths.engineSrcPath)

        // copy content types into src
        for (let dir of ALL_TYPES) {
            let contentFolder = path.join(paths.contentDir, dir)
            let engineSrcFolder = path.join(paths.engineSrcPath, dir)
            await utils.copyDir(contentFolder, engineSrcFolder)
        }


        // get config info
        let objConfig = await utils.getConfig()
        let { taglist: userTaglist, ...metaConfig } = objConfig
        let actualTagList = await utils.getTags(true)

        // remove tags that don't exist
        let usedTags = userTaglist.filter(t => actualTagList.includes(t.name))

        // add empty tags that do
        let usedTagNames = usedTags.map(t => t.name)
        let missingTagNames = actualTagList.filter(t => usedTagNames.includes(t))
        let missingTags = missingTagNames.map(t => ({ name: t, description: "" }))
        let allTags = usedTags.concat(missingTags)

        // save config in data
        await writeJson(paths.engineTempDataConfigPath, metaConfig)

        // save taglist in data
        await writeJson(paths.engineTempDataTaglistPath, allTags)

        // exit early
        if (options.preCompile) { return }



        // change working directory, run 11ty, change back
        process.chdir(paths.engineDir);
        await utils.cmd(`npx @11ty/eleventy`);
        process.chdir(paths.contentDir);



        // move _site from engine to content
        //await utils.copyDir(paths.engineSitePath, paths.contentSitePath)
        await fs.rename(paths.engineSitePath, paths.contentSitePath)

        if (!options.keepTemp) {
            // cleanup local temp & site
            await utils.removeDir(paths.engineSrcPath)
            await fs.rename(paths.engineTempPath, paths.engineSrcPath)
        }



    } catch (err) {
        console.log({ err });
    }

}




async function writeJson(filePath, obj) {
    let content = JSON.stringify(obj, null, 2)
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, content, 'utf8')
}