#!/usr/bin/env node

main()

async function main() {
    let cwd = process.cwd()
    console.log({ __dirname, __filename, cwd })
}