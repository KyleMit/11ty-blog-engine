const { minify } = require("terser")

/**
 * Minify JS source code
 *
 * @param {String} jsSource
 */
module.exports = async function (jsSource, callback) {
  if (process.env.ELEVENTY_ENV === "dev") {
    callback(null, jsSource)
  }

  try {
    const minified = await minify(jsSource)
    callback(null, minified.code)
  } catch (err) {
    console.error("Terser error: ", err)
    // Fail gracefully.
    callback(null, jsSource)
  }
}
