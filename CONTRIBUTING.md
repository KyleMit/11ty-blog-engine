# Contributing


## File Structure

### Blog Contents

* Config
  * .vscode/
  * .config/
    * taglist.yaml
    * .eleventyblog.yml
    * bio.md
    * favicon.json
    * favicon.svg
  * .cache/
  * .eleventyblog.yml
  * .env (optional for tweets)

* Gitignore
  * node_modules
  * _site

* Assets
  * assets/
  * samples/

* Content
  * acronyms/
  * authors/
  * drafts/
  * notes/
  * slides/
  * pages/
  * posts/

* Root
  * Readme
  * License
  * Code of Conduct


### Blog Engine

* Utilities
* CLI
* Tools
* Pages/meta
* Pages/site
* Layouts
* Admin
* Includes
  * Partials
  * Images
  * Icons
  * Scripts
  * Styles


### Configuration Options


```yml
title: VT Covid Bot Docs
baseurl: "/covid-bot" # the subpath of your site, e.g. /blog
url: "https://vermontdepartmentofhealth.github.io" # the base hostname & protocol for your site, e.g. http://example.com
remote_theme: VermontDepartmentOfHealth/cayman
exclude: ["*.*"]
include: ["*.md", "*.liquid"]
```

* add themes
* navbar order
* JSON Schema Validator
* bio
* taglist




## Features


### CLI

* Add Front Matter (based on type)
* Add Eject Option (react cli does this)
* One Click Publish to Netlify
* All folders optional


```bash
npx eleventy-blog             # default command -> build
npx eleventy-blog build       # create _site
npx eleventy-blog serve       # create _site and then serve
npx eleventy-blog clean       # create _site and then serve
npx eleventy-blog new <my-app-name>        # walk through creation - ask for name
npx eleventy-blog generate <type-of-file> <file-name>         # walk through creation - ask for name
npx eleventy-blog eject       # 1 way
npx eleventy-blog debug       # make it easier to start a debug session
npx eleventy-blog lint        # audit for common mistakes
npx eleventy-blog publish     # github pages / netlify
npx eleventy-blog version     # list version information
npx eleventy-blog help        # display  command options
npx eleventy-blog interactive # walk through of command options
```

* default cmd
  * has config -> build
  * no config  -> new

### Linting

* Dead links
* External images
* No Alt Tags


### VS Code Extension

* Need VS Code Extension or NPM CLI
* Extension can help with intellisense
  * Frontmatter Snippets


### Error Handling

Catch nunjucks exception in markdown file and add helpful error log

* if you never plan on using dynamic templating, turn off templates
* if you might want dynamic templating,


## Search

* VanillaJS
* [Algolia search](https://github.com/algolia/algoliasearch-netlify)

## Deployment

* [Creating a template repository - GitHub Docs](https://docs.github.com/en/free-pro-team@latest/github/creating-cloning-and-archiving-repositories/creating-a-template-repository)
* [Introducing the Deploy to Netlify button | Netlify](https://www.netlify.com/blog/2016/11/29/introducing-the-deploy-to-netlify-button/)



## Architecture

### Invocation Options

* Eleventy Wrapper - Requires NPX
* Eleventy Plugin - Requires installation / package.json


### Prior Art

> Combination of [jekyll gh-pages](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/about-github-pages-and-jekyll), [create-react-app](https://create-react-app.dev/), and powered by [eleventy](https://www.11ty.dev/)


* [create-react-app](https://create-react-app.dev/)
* [gh-pages](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/about-github-pages-and-jekyll)
* [Ember CLI Commands](https://cli.emberjs.com/release/basic-use/cli-commands/)
* [11ty/eleventy-base-blog](https://github.com/11ty/eleventy-base-blog) - A starter repository for a blog web site using the Eleventy static site generator

### Build Steps

* Copy `src` -> `src.bak`
* Copy `client`/`types` -> `src`/
* Transform Config -> `data/config`
* Pre-processing
  * Generate Favicons
* run eleventy
  * Twitter API
  * Images?
* Post-processing?
  * Images?

Possible to Cache any steps?

### Github Actions

[github actions check if package version increased](https://github.com/marketplace/actions/version-check)


### Debugging

[Debugging Node.JS CLI application with VSCode?](https://stackoverflow.com/q/29955126/1366033)
[sidorares/**node-cli-debugger**](https://github.com/sidorares/node-cli-debugger) - node.js command-line debugger


### Previous Scripts

```json
{
  "build": "npm run zip && npx cross-env ELEVENTY_ENV=prod npx @11ty/eleventy",
  "serve": "npx cross-env ELEVENTY_ENV=dev  npx @11ty/eleventy --serve",
  "clean": "npx rimraf _site",
  "zip": "node ./utilities/zip-samples.js",
  "clear-cache": "npx rimraf tweets",
  "favicon": "npx real-favicon generate \"./tools/favicon-generator.json\" \"./tools/faviconData.json\" \"./assets/images/icons/fav\""
}
```



## Todo

* Include author bio / bios
* About Me / Authors
* Include Icons for notes
* Notes Views
  * View Filter
    * Icon Grid
    * Tree View
    * Details
* Advanced Search
