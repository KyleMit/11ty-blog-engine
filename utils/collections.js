module.exports = {
    buildSlides,
    buildPublished,
    buildBundles
}

function buildSlides(col, md) {
    let presentations = col.getFilteredByTag("presentation")

    let allSlides = presentations.map(pres => {
        let content = pres.template.frontMatter.content
        let pages = content.split(/\r?\n---\r?\n/)

        // add metadata to slides level
        let slides = pages.map((page, i) => {
            let slide = {
                href: `/slides/${pres.fileSlug}/${i + 1}/`,
                pres: {
                    title: pres.data.title,
                    summary: pres.data.summary,
                    totalPages: pages.length,
                    fileSlug: pres.fileSlug
                },
                cur: {
                    content: page,
                    html: md.render(page),
                    curPage: i + 1,
                    perComplete: `${Math.round(((i + 1) / pages.length) * 100)}%`
                }
            }

            return slide
        })


        // add previous and next
        for (let i = 0; i < slides.length; i++) {
            const prev = slides[i - 1];
            const next = slides[i + 1];

            slides[i].prev = prev;
            slides[i].next = next;
        }

        return slides
    })

    // flat map all slides
    let flatSlides = allSlides.reduce((a, b) => a.concat(b), []);

    return flatSlides
}

function buildPublished(col) {

    let posts = col.getFilteredByTag("post").filter(item => !item.data.draft)

    // add previous and next
    for (let i = 0; i < posts.length; i++) {
        const prevPost = posts[i - 1];
        const nextPost = posts[i + 1];

        posts[i].data.prevPost = prevPost;
        posts[i].data.nextPost = nextPost;
    }

    return posts;

}

function buildBundles(col) {

    let script = col.getFilteredByGlob("**/meta/bundle-scripts.js.njk")[0]
    let style = col.getFilteredByGlob("**/meta/bundle-styles.css.njk")[0]
    return { script, style }

}