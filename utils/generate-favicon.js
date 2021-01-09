const path = require("path")
const { promises: fs } = require("fs")
const { promisify } = require("util")
const rfg = require("rfg-api").init()
const utils = require("../cli/utils")

const { paths } = utils

// TODO - rely on user key
const API_KEY = "402333a17311c9aa68257b9c5fc571276090ee56"

module.exports = main

async function main(config) {
  let cacheFaviconFolder = path.join(paths.contentDir, "/.cache/favicon/")
  let outputDir = path.join(paths.engineSrcPath, "/includes/icons/favicon/")
  let faviconFile = path.join(paths.engineSrcPath, "/faviconData.json")

  let cacheExists = await utils.checkDirExists(cacheFaviconFolder)
  if (cacheExists) {
    await utils.copyDir(cacheFaviconFolder, outputDir)
    return
  }

  // get favicon json files & combine
  let mainSettings = await getSettings(config)

  // get favicon path and combine
  let mainFavicon = await getFavicon(config)

  let opts = {
    masterPicture: mainFavicon,
    iconsPath: "/includes/images/icons/favicon/",
    design: mainSettings.design,
    settings: mainSettings.settings,
    apiKey: API_KEY,
  }

  let request = rfg.createRequest(opts)

  // promisify
  let generateFaviconAsync = promisify(rfg.generateFavicon)

  let generatedResult = await generateFaviconAsync(request, outputDir)
  await fs.writeFile(
    faviconFile,
    JSON.stringify(generatedResult, null, 2),
    "utf8"
  )

  // write favicons to cache
  // todo use settings to configure cache usage
  await utils.copyDir(outputDir, cacheFaviconFolder)
}

async function getFavicon(config) {
  let userFavicon = path.join(paths.contentDir, "/.config/favicon.svg")
  let defaultFavicon = path.join(paths.engineDir, "/.config/favicon.svg")

  // TODO - update colors on default favicon with theme and accent colors if we're going to use it

  let mainFavicon = (await utils.checkFileExists(userFavicon))
    ? userFavicon
    : defaultFavicon
  return mainFavicon
}

async function getSettings(config) {
  let userSettingsPath = path.join(paths.contentDir, "/.config/favicon.json")
  let defaultSettingsPath = path.join(paths.engineDir, "/.config/favicon.json")

  let userSettingsExist = await utils.checkFileExists(userSettingsPath)

  if (userSettingsExist) {
    return await utils.readJson(userSettingsPath)
  } else {
    let defaultSettings = await utils.readJson(defaultSettingsPath)

    defaultSettings.design.androidChrome.manifest.name = config.title
    defaultSettings.design.androidChrome.themeColor = config.themeColor

    return defaultSettings
  }
}
