module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("assets");

    return {
        dir: {
            data: "data",
            input: "src"
        },
    };
};