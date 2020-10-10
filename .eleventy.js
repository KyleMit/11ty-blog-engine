module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("temp/assets");

    return {
        dir: {
            data: "data",
            input: "temp"
        },
    };
};