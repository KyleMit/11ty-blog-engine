const { promisify } = require('util');
const { promises: fs } = require("fs")
const path = require("path")
const cp = require('child_process')
const exec = promisify(cp.exec);
const yaml = require('js-yaml');

const CONFIG_NAME = ".eleventyblog.yml"

async function cmd(text) {
    const { stdout, stderr } = await exec(text);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}

function getDirectories() {
    let contentDir = process.cwd()
    let engineDir = __dirname.replace(/utils$/, "")
    return { contentDir, engineDir }
}

async function getConfig() {
    let { contentDir, engineDir } = getDirectories()

    let defaultConfigPath = path.join(engineDir, CONFIG_NAME)
    let userConfigPath = path.join(contentDir, CONFIG_NAME)

    let defaultConfig = await readYaml(defaultConfigPath)
    let userConfig = await readYaml(userConfigPath)

    let config = Object.assign({}, defaultConfig, userConfig)

    return config
}

async function readYaml(path) {
    let text = await fs.readFile(path, 'utf8')
    let output = yaml.safeLoad(text)
    return output
}


module.exports = {
    cmd,
    directories: getDirectories(),
    getConfig
}