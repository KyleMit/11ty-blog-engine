#!/usr/bin/env node

const inquirer = require('inquirer');
const { program } = require('commander');
const { version } = require("./package.json")
const cli = require("./cli/_index")
const utils = require("./utils/utils")


main()

async function main() {

    // list all commands
    program
        .command('build', { isDefault: true })
        .description('build contents into blog')
        .action(async(cmd) => {
            await cli.build()
        })

    program
        .command('serve')
        .description('build contents into blog and serve locally')
        .action(async(cmd) => {
            await cli.build()
            utils.cmd("npx http-server ./_site -o")
        })


    /* global options and start */
    await program
        .name("create-eleventy-blog")
        .version(version)
        .parseAsync(process.argv);
}