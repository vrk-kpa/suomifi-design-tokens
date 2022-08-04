#!/usr/bin/env node
'use strict';
const path = require('path');
const fs = require('fs');
const { Command } = require('commander');

const tokensData = require('./tokens.json');
const derivedTokensData = require('./derived-tokens.json');
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
    const derviedTokensByCategory = tokensParser(
      derivedTokensData,
      derivedTokensData.tokens,
    );

    derviedTokensByCategory.forEach((category) => {
      category.tokens.forEach((derivedToken) => {
        if (derivedToken.type === 'derived-string') {
          const variables = derivedToken.value.value.match(/\{.+?\}/g);
          variables.forEach((variable) => {
            let strippedVar = variable.replace(/[{} ]/g, '');

            const mainParts = strippedVar.split(',');
            let variablePart = mainParts[0];
            const modifierPart = mainParts.length === 2 ? mainParts[1] : null;

            variablePart = variablePart.split('.');
            const matchingToken = tokensByCategory
              .find((cat) => cat.category === variablePart[0])
              .tokens.find((t) => t.name === variablePart[1]);
            if (!matchingToken) {
              throw new Error(
                `Unable to find a matching token for derived token variable ${strippedVar}`,
              );
            }

            let derivedValueString = '';
            if (matchingToken.category === 'colors') {
              derivedValueString = convertHslMapToString(
                matchingToken.value,
                modifierPart,
              );
            } else if (matchingToken.category === 'radiuses') {
              derivedValueString =
                matchingToken.value.value + matchingToken.value.unit;
            }

            derivedToken.value.value = derivedToken.value.value.replace(
              variable,
              derivedValueString,
            );
          });
        } else if (derivedToken.type === 'derived-object') {
          const valuesWithVariables = [];
          // See which values have variables
          Object.entries(derivedToken.value).forEach((entry) => {
            const [key, value] = entry;
            if (String(value).includes('{')) {
              valuesWithVariables.push({ key: key, value: value });
            }
          });
          valuesWithVariables.forEach((valWithVar) => {
            const variables = valWithVar.value.match(/\{.+?\}/g);
            variables.forEach((variable) => {
              let strippedVar = variable.replace(/[{} ]/g, '');

              const mainParts = strippedVar.split(',');
              let variablePart = mainParts[0];
              const modifierPart = mainParts.length === 2 ? mainParts[1] : null;

              variablePart = variablePart.split('.');
              const matchingToken = tokensByCategory
                .find((cat) => cat.category === variablePart[0])
                .tokens.find((t) => t.name === variablePart[1]);
              if (!matchingToken) {
                throw new Error(
                  `Unable to find a matching token for derived token variable ${strippedVar}`,
                );
              }

              let derivedValueString = '';
              if (matchingToken.category === 'colors') {
                derivedValueString = convertHslMapToString(
                  matchingToken.value,
                  modifierPart,
                );
              } else if (matchingToken.category === 'radiuses') {
                derivedValueString =
                  matchingToken.value.value + matchingToken.value.unit;
              }

              derivedToken.value[valWithVar.key] = derivedToken.value[
                valWithVar.key
              ].replace(variable, derivedValueString);
            });
          });
        }
      });
    });

    const allTokens = tokensByCategory.concat(derviedTokensByCategory);

    opts.format.split(' ').forEach((format) => {
      if (converters[format] == undefined) {
        throw `No converter found for ${format}`;
      } else {
        const exportData = getFormattedTokens(
          converters[format].converters,
          allTokens,
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
  formatters.forEach((formatter) => {
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
    fs.writeFile(path.join(dirname, fileName), data, (err) => {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    console.warn(`Writing to file ${outDir}/${fileName} failed!`);
    console.warn(err);
  }
}

function convertHslMapToString(hslMap, modifier) {
  if (modifier && modifier.startsWith('alpha-')) {
    const alphaValue = modifier.substring(6);
    return `hsla(${hslMap.h}, ${hslMap.s}%, ${hslMap.l}%, ${alphaValue})`;
  }
  return `hsl(${hslMap.h}, ${hslMap.s}%, ${hslMap.l}%)`;
}

main();
