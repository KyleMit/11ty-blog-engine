const utils = require("./utils")

module.exports = main

// use --fix param to auto fix
async function main() {
  console.log("looks good!")

  // check missing tags (fix)
  // check 404 urls
  // check external images (fix)

  let taglist = await utils.getTags()

  console.log(taglist)
}

function groupTags(tags) {
  // sort alphabetically
  let alphaTags = objectTags.sort((a, b) => a.tag.localeCompare(b.tag))

  // group by and count
  let groupedTags = metaTags.reduce((grp, tag) => ((grp[tag] = ++grp[tag] || 1), grp), {})

  // map to objects
  let objectTags = Object.keys(groupedTags).map((tag) => ({
    tag,
    count: groupedTags[tag],
  }))

  // sort by count
  let countTags = objectTags.sort((a, b) => b.count - a.count)

  console.table(alphaTags)
  console.table(countTags)
}
