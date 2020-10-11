const { promisify } = require('util');
const fsRoot = require("fs")
const path = require("path")
const cp = require('child_process')
const yaml = require('js-yaml');
const yamlFront = require('yaml-front-matter');

const { FILES, FOLDERS, CONTENT_TYPES } = require("./consts")

const exec = promisify(cp.exec);
const fs = fsRoot.promises

const directories = getDirectories()
const paths = getPaths()

module.exports = {
    directories,
    paths,
    cmd,
    getConfig,
    checkDirExists,
    checkConfigExists,
    copyDir,
    removeDir,
    readYamlDir,
    getTags
}

function getDirectories() {
    let contentDir = process.cwd()
    let engineDir = __dirname.replace(/utils$/, "")
    return { contentDir, engineDir }
}

function getPaths() {
    // get directories
    let { contentDir, engineDir } = directories

    let contentSitePath = path.join(contentDir, FOLDERS.site)
    let contentConfigPath = path.join(contentDir, FILES.configInput)

    let engineConfigPath = path.join(engineDir, FILES.configInput)
    let engineSrcPath = path.join(engineDir, FOLDERS.src)
    let engineSrcDataPath = path.join(engineSrcPath, FOLDERS.data)
    let engineSrcDataConfigPath = path.join(engineSrcDataPath, FILES.configOutput)
    let engineSrcDataTaglistPath = path.join(engineSrcDataPath, FILES.taglist)
    let engineSitePath = path.join(engineDir, FOLDERS.site)
    let engineTypesPath = path.join(engineDir, FOLDERS.types)
    let engineTempPath = path.join(engineDir, FOLDERS.temp)


    let output = { contentDir, contentSitePath, contentConfigPath, engineDir, engineConfigPath, engineSrcPath, engineTypesPath, engineTempPath, engineSrcDataPath, engineSrcDataConfigPath, engineSrcDataTaglistPath, engineSitePath }
    return output
}


async function cmd(text) {
    const { stdout, stderr } = await exec(text);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}


async function getConfig() {

    let defaultConfig = await readYaml(paths.engineConfigPath)
    let userConfig = await readYaml(paths.contentConfigPath)

    let urlConfig = getUrlConfig()

    let config = Object.assign({}, defaultConfig, userConfig, urlConfig)

    return config
}

function getUrlConfig() {

    // netlify build variables - https://www.netlify.com/docs/continuous-deployment/#build-environment-variables
    let { CONTEXT, URL, DEPLOY_PRIME_URL } = process.env

    // get build environment
    let { ELEVENTY_ENV } = process.env

    let defaultDevUrl = 'http://localhost:8080'


    let buildContext = (CONTEXT) ? CONTEXT : 'development' //  production | deploy-preview | branch-deploy | development
    let baseUrl = CONTEXT == 'production' ? URL : DEPLOY_PRIME_URL || defaultDevUrl
    let baseUrlCanonical = (URL) ? URL : defaultDevUrl
    let metaRobots = (CONTEXT == 'production') ? 'INDEX,FOLLOW' : 'NOINDEX,NOFOLLOW'

    let output = { CONTEXT, URL, DEPLOY_PRIME_URL, ELEVENTY_ENV, buildContext, baseUrl, baseUrlCanonical, metaRobots }
    return output
}

async function readYaml(path) {
    let text = await fs.readFile(path, 'utf8')
    let output = yaml.safeLoad(text)
    return output
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

async function removeDir(...paths) {
    await Promise.all(paths.map(async(p) => {
        await fs.rmdir(p, { recursive: true });
    }));
}


async function checkDirExists(dir) {
    try {
        let stat = await fs.lstat(dir)
        return stat.isDirectory()
    } catch (error) {
        return false;
    }
}

async function checkConfigExists() {
    try {
        await fs.access(paths.contentConfigPath, fsRoot.constants.R_OK)
        return true
    } catch (error) {
        return false
    }
}


async function getTags(returnUnique) {

    let metadata = []

    // copy content types into temp
    for (let dir of CONTENT_TYPES) {
        let contentFolder = path.join(paths.contentDir, dir)
        await readYamlDir(contentFolder, metadata)
    }

    // get all tag data from frontmatter
    let tags = metadata.filter(d => d.tags).map(d => d.tags)

    // flatten array of arrays
    let flatTags = tags.reduce((a, b) => a.concat(b), []);

    // remove 'post' tags
    let metaTags = flatTags.filter(t => t.toLowerCase() !== "post")

    return returnUnique ? [...new Set(metaTags)] : metaTags
}


async function readYamlDir(src, arr) {
    if (!(await checkDirExists(src))) { return }

    let entries = await fs.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);

        entry.isDirectory() ?
            await readYamlDir(srcPath, arr) :
            await readYamlFile(srcPath, arr)
    }

    return arr
}

async function readYamlFile(src, arr) {
    let text = await fs.readFile(src, "utf8")
    let data = yamlFront.loadFront(text)
    arr.push(data)
}