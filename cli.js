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
        .description('default command - either run build or create project')
        .action(async(cmd) => {
            // check for user config
            if (checkConfigExists()) {
                // if exists, run build
                await cli.build(cmd.keepTemp)
            } else {
                // if !exists, create new project
                await cli.create()
            }
        })

    program
        .command('new')
        .description('scaffold out new project')
        .option('-y, --yes-to-all', 'Auto accept all prompts for non-interactive project setup')
        .action(async(cmd) => {
            await cli.create(cmd.yesToAll)
        })

    program
        .command('build')
        .description('build contents into blog')
        .option('-k, --keep-temp', 'Keep Temp Files (helpful for debugging)')
        .option('-pc, --pre-compile', 'Precompile Site Output (helpful for debugging)')
        .action(async(cmd) => {
            let { keepTemp, preCompile } = cmd
            let options = { keepTemp, preCompile }
            await cli.build(options)
        })

    program
        .command('serve')
        .description('build contents into blog and serve locally')
        .action(async(cmd) => {
            await cli.build()
            utils.cmd("npx http-server ./_site -o")
        })

    program
        .command('clean')
        .description('cleans up temp files from local and build directories')
        .action(async(cmd) => {
            await cli.clean()
        })

    program
        .command('lint')
        .description('check for common issues')
        .option('-f, --fix', 'Fix automatically fixable issues')
        .action(async(cmd) => {
            await cli.lint(cmd.fix)
        })

    /* global options and start */
    await program
        .name("create-eleventy-blog")
        .version(version)
        .parseAsync(process.argv);
}