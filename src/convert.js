#!/usr/bin/env node
'use strict';
const path = require('path');
const fs = require('fs');
const { Command, Option } = require('commander');

const tokensData = require('./tokens.json');
const tokensParser = require('./tokens-parser');
const converters = require('./converters');

function main() {
  try {
    const program = new Command();
    program
      .option('--outdir <outdir>', 'output directory')
      .option('--format <format>', 'format to output') // supports only scss and ts
      .parse(process.argv);
    const opts = program.opts();

    const tokensByCategory = tokensParser(tokensData, tokensData.tokens);

    opts.format.split(' ').forEach(format => {
      if (converters[format] == undefined) {
        throw `No converter found for ${format}`;
      } else {
        const exportData = getFormattedTokens(
          converters[format].converters,
          tokensByCategory,
        );
        exportFile(
          `${opts.outdir}`,
          `${converters[format].outFileName}.${format}`,
          exportData,
        );
      }
    });
  } catch (err) {
    console.warn(err);
  }
}

function getFormattedTokens(formatters, tokensByCategory) {
  let formattedTokens = '';
  formatters.forEach(formatter => {
    formattedTokens += formatter.convert(tokensByCategory);
  });
  return formattedTokens;
}

function exportFile(outDir, fileName, data) {
  const dirname = path.normalize(outDir);
  try {
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }
    fs.writeFile(path.join(dirname, fileName), data, err => {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    console.warn(`Writing to file ${outDir}/${fileName} failed!`);
    console.warn(err);
  }
}

main();







