#!/usr/bin/env node

//const inquirer = require('inquirer');
const { program } = require('commander');
const { version } = require("../package.json")
const cli = require("./_index")
const utils = require("../utils/utils")

console.log("sefef")

main()

async function main() {

    // list all commands
    program
        .description('default command - either run build or create project')
        .action(async(cmd) => {
            // check for user config
            if (utils.checkConfigExists()) {
                // if exists, run build
                await cli.build({ environment: "prod" })
            } else {
                // if !exists, create new project
                await cli.create(false)
            }
        })

    program
        .command('new')
        .description('scaffold out new project')
        .option('-y, --yes-to-all', 'Auto accept all prompts for non-interactive project setup', false)
        .action(async(cmd) => {
            await cli.create(cmd.yesToAll)
        })

    program
        .command('build')
        .description('build contents into blog')
        .option('-pc, --pre-compile', 'Precompile Site Output (helpful for debugging)', false)
        .option('-e, --environment', 'Build environment - production runs full build (dev | prod)', "prod")
        .option('-s, --serve', 'Spins up a simple http server in the output directory after build', false)
        .action(async(cmd) => {
            let { preCompile, environment, serve } = cmd
            let options = { preCompile, environment }
            await cli.build(options)
            if (serve) { utils.cmd("npx http-server ./_site -o") }
        })

    program
        .command('serve')
        .description('build contents into blog and serve locally')
        .option('-e, --environment', 'Build environment - production runs full build  (dev | prod)', "dev")
        .action(async(cmd) => {
            let { environment } = cmd
            let options = { environment }
            await cli.build(options)
            utils.cmd("npx http-server ./_site -o")
        })

    program
        .command('clean')
        .description('cleans up temp files from local and build directories')
        .option('-t, --target', 'The location to cleanup files (content | engine | both)', "both")
        .action(async(cmd) => {
            let { target } = cmd
            let options = { target }
            await cli.clean(options)
        })

    program
        .command('lint')
        .description('check for common issues')
        .option('-f, --fix', 'Fix automatically fixable issues')
        .action(async(cmd) => {
            await cli.lint(cmd.fix)
        })

    program
        .command('debug')
        .description('setup workspace to debug cli')
        .action(async(cmd) => {
            await cli.debug()
        })

    /* global options and start */
    await program
        .name("create-eleventy-blog")
        .version(version)
        .parseAsync(process.argv);
}