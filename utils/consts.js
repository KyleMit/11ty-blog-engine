const FOLDERS = {
    site: "_site",
    src: "src",
    temp: "src.bak",
    types: "types",
    assets: "assets",
    data: "data"
}

const FILES = {
    configInput: ".eleventyblog.yml",
    configOutput: "config.json",
    taglist: "taglist.json"
}

const ASSET_TYPES = [
    "assets",
    "samples"
]

const CONTENT_TYPES = [
    "acronyms",
    "drafts",
    "notes",
    "pages",
    "posts",
    "slides",
]

const ALL_TYPES = CONTENT_TYPES.concat(...CONTENT_TYPES)

module.exports = {
    FOLDERS,
    FILES,
    CONTENT_TYPES,
    ASSET_TYPES,
    ALL_TYPES
}