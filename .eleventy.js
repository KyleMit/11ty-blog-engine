let md = require("./utils/customize-markdown.js")();
let collections = require("./utils/collections");

module.exports = function (eleventyConfig) {
  // eleventyConfig.setUseGitIgnore(false);

  // static passthroughs - remap to root
  eleventyConfig.addPassthroughCopy({ "src/includes/icons/favicon/favicon.ico": "/favicon.ico" });
  eleventyConfig.addPassthroughCopy({ "src/includes/icons/favicon/site.webmanifest": "/site.webmanifest" });
  eleventyConfig.addPassthroughCopy({ "src/includes/scripts/service-worker.js": "/service-worker.js" });

  eleventyConfig.addPassthroughCopy("src/includes/icons");
  eleventyConfig.addPassthroughCopy("src/includes/images");
  eleventyConfig.addPassthroughCopy("src/includes/scripts");
  eleventyConfig.addPassthroughCopy("src/includes/styles");
  eleventyConfig.addPassthroughCopy("src/admin");

  // user assets
  eleventyConfig.addPassthroughCopy("src/assets");

  // grab 3rd party dependencies
  eleventyConfig.addPassthroughCopy({ "node_modules/mark.js/dist/mark.min.js": "/vendor/scripts/mark.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/gumshoejs/dist/gumshoe.polyfills.min.js": "/vendor/scripts/gumshoe.js" });
  eleventyConfig.addPassthroughCopy({ "node_modules/highlightjs/styles": "/vendor/styles/hljs" });
  eleventyConfig.addPassthroughCopy({ "node_modules/firacode/distr/woff": "/assets/fonts/" });
  eleventyConfig.addPassthroughCopy({ "node_modules/firacode/distr/woff2/": "/assets/fonts/" });
  eleventyConfig.addPassthroughCopy({ "node_modules/typeface-noto-serif/files": "/assets/fonts/" });
  eleventyConfig.addPassthroughCopy({ "node_modules/typeface-roboto/files": "/assets/fonts/" });

  // add filters
  eleventyConfig.addFilter("cssmin", require("./utils/clean-css.js"));
  eleventyConfig.addFilter("jsmin", require("./utils/clean-js.js"));
  eleventyConfig.addFilter("dateDisplay", require("./utils/dates.js"));
  eleventyConfig.addFilter("removeHash", html => html.replace(/ #/g, ""));
  eleventyConfig.addFilter("removeParen", html => html.replace(/\(.*?\)/g, ""));
  eleventyConfig.addFilter("lastDir", str => str.split("/").pop());
  eleventyConfig.addFilter("contentTags", tags => tags.filter(t => !["post", "draft"].includes(t)));
  eleventyConfig.addFilter("findByName", (arr, findValue) => arr.find(a => a.name === findValue));
  eleventyConfig.addFilter("isPostType", tags => tags && tags.some(t => ["post", "draft"].includes(t)));
  eleventyConfig.addFilter("isDraft", tags => tags && tags.some(t => t === 'draft'));
  eleventyConfig.addFilter("take", (array, n) => array.slice(0, n));
  eleventyConfig.addFilter("sortByPostCount", arr => arr.sort((a, b) => (a.posts.length < b.posts.length ? 1 : -1)));

  // custom collections
  eleventyConfig.addCollection("drafts", (col) =>
    col.getFilteredByTag("post").filter((item) => item.data.draft)
  );
  eleventyConfig.addCollection("published", collections.buildPublished);
  eleventyConfig.addCollection("slides", (col) =>
    collections.buildSlides(col, md)
  );

  eleventyConfig.addCollection("bundles", collections.buildBundles);

  // configure syntax highlighting
  eleventyConfig.setLibrary("md", md);

  // add shortcodes
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  eleventyConfig.addPairedShortcode("markdown", (content, inline = null) => {
    return inline ? md.renderInline(content) : md.render(content);
  });

  // add plugins
  let pluginTOC = require("eleventy-plugin-nesting-toc");
  eleventyConfig.addPlugin(pluginTOC, { tags: ["h2, h3"] });

  /* embed tweet plugin setup */
  let pluginEmbedTweet = require("eleventy-plugin-embed-tweet");
  let tweetEmbedOptions = {
    cacheDirectory: "tweets",
    useInlineStyles: false,
  };
  eleventyConfig.addPlugin(pluginEmbedTweet, tweetEmbedOptions);

  return {
    dir: {
      data: "data",
      includes: "assets",
      layouts: "layouts",
      input: "src",
    },

    // By default markdown files are pre-processing with liquid template engine
    // https://www.11ty.io/docs/config/#default-template-engine-for-markdown-files
    markdownTemplateEngine: "njk",
  };
};
