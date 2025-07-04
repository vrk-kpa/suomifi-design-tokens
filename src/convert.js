#!/usr/bin/env node
'use strict';
const path = require('path');
const fs = require('fs');
const { Command } = require('commander');

const tokensData = require('./tokens.json');
const derivedTokensData = require('./derived-tokens.json');
const tokensParser = require('./tokens-parser');
const converters = require('./converters');

function convertTokenNames(tokensByCategory) {
  return tokensByCategory.map((category) => {
    if (category.category === 'breakpoints') {
      // Convert breakpoint token names from "sBreakpoint" -> "s", "mBreakpoint" -> "m", etc.
      const convertedTokens = category.tokens.map((token) => {
        const newName = token.name.replace(/Breakpoint$/, ''); // Remove "Breakpoint" suffix
        return {
          ...token,
          name: newName,
        };
      });
      return {
        ...category,
        tokens: convertedTokens,
      };
    }
    return category; // Return other categories unchanged
  });
}

function main() {
  try {
    const program = new Command();
    program
      .option('--outdir <outdir>', 'output directory')
      .option('--format <format>', 'format to output') // supports only scss and ts
      .parse(process.argv);
    const opts = program.opts();

    // Get basic tokens grouped by category
    const basicTokensByCategory = tokensParser(tokensData, tokensData.tokens);
    // Get derived tokens grouped by category
    const derivedTokensByCategory = tokensParser(
      derivedTokensData,
      derivedTokensData.tokens,
    );

    /**
     * Derived tokens contain variables which correspond to a value in the
     * basicTokens. For example, gradient "highlightBaseToHighlightDark1" is defined as
     * linear-gradient(0deg, {colors.highlightBase} 0%, {colors.highlightDark1} 100%)
     *
     * We have to find these variables inside curly brackets {} and replace them with the correct token value.
     * For example, "highlightBaseToHighlightDark1" would then become
     * linear-gradient(0deg, hsl(212, 63%, 45%) 0%, hsl(212, 63%, 37%) 100%)
     */
    derivedTokensByCategory.forEach((category) => {
      category.tokens.forEach((derivedToken) => {
        // Derived token type 'derived-string' only contains one (string) value, let's handle it in this if-block
        if (derivedToken.type === 'derived-string') {
          // Find the variables in the value string. They are inside curly brackets {}
          const variables = derivedToken.value.value.match(/\{.+?\}/g);
          // A single string might contain multiple variables. Let's handle them all
          variables.forEach((variable) => {
            // Strip away the curly brackets {}
            let strippedVar = variable.replace(/[{} ]/g, '');

            /**
             * A derived token variable consist of 2 parts: mainPart and modifierPart
             * mainPart contains the actual basicToken mapping (e.g. colors.highlightBase)
             * modifierPart is optional and contains a value which manipulates the mainPart in some way
             * For now, the modifierPart is used only for colors, containing the alpha channel which is
             * missing from the basic colors
             *
             * Example of a variable with both the variabelPart and the modifierPart:
             * {colors.whiteBase, alpha-0.1}
             * */
            const mainParts = strippedVar.split(',');
            let variablePart = mainParts[0];
            const modifierPart = mainParts.length === 2 ? mainParts[1] : null;

            /**
             * The variablePart consists of 2 parts as well: category and name
             * They are separated by a period.
             * Example: colors.highlightBase
             */
            variablePart = variablePart.split('.');
            /**
             * Now let's find a match from the basicTokens
             * First through the category and then the actual name
             */
            const matchingToken = basicTokensByCategory
              .find((cat) => cat.category === variablePart[0])
              .tokens.find((t) => t.name === variablePart[1]);
            if (!matchingToken) {
              throw new Error(
                `Unable to find a matching token for derived token variable ${strippedVar}`,
              );
            }

            /**
             * Then parse together the string we want to insert into the derived token
             * in place of the variable.
             * Different categories must be handled in a slightly different way
             * For now, only colors and radiuses are used in variables so we have handlers for them
             */
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

            // And finally, insert the parsed-together token in place of the original variable string
            derivedToken.value.value = derivedToken.value.value.replace(
              variable,
              derivedValueString,
            );
          });

          /**
           * A derived token can also be of type 'derived-object'
           * This follows the same idea as 'derived-string', but it consists of more than one CSS property
           * which might all have variables inside them
           * 
           * For example "boxShadowFocus" is defined as
           * "value": {
                "outline": "0",
                "borderRadius": "{radiuses.focus}",
                "boxShadow": "0 0 0 2px {colors.accentSecondary}"
              }
           */
        } else if (derivedToken.type === 'derived-object') {
          const valuesWithVariables = [];
          // Loop trough all keys in the value-object to see which of them contain variables
          Object.entries(derivedToken.value).forEach((entry) => {
            const [key, value] = entry;
            if (String(value).includes('{')) {
              valuesWithVariables.push({ key: key, value: value });
            }
          });
          /**
           * The rest is pretty much the same as for the derived-string type:
           * We find the corresponding basicToken for each variable and
           * replace it inside the original derived token JSON object
           */
          valuesWithVariables.forEach((valWithVar) => {
            const variables = valWithVar.value.match(/\{.+?\}/g);
            variables.forEach((variable) => {
              let strippedVar = variable.replace(/[{} ]/g, '');

              const mainParts = strippedVar.split(',');
              let variablePart = mainParts[0];
              const modifierPart = mainParts.length === 2 ? mainParts[1] : null;

              variablePart = variablePart.split('.');
              const matchingToken = basicTokensByCategory
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

              /**
               * This part is slightly different compared to 'derived-string', since the
               * 'derived-object' contains multiple keys instead of just one
               */
              derivedToken.value[valWithVar.key] = derivedToken.value[
                valWithVar.key
              ].replace(variable, derivedValueString);
            });
          });
        }
      });
    });

    // At the end, we put basicTokens and derivedTokens into a single array and run them through the converters
    const allTokens = convertTokenNames(
      basicTokensByCategory.concat(derivedTokensByCategory),
    );

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

function getFormattedTokens(formatters, basicTokensByCategory) {
  let formattedTokens = '';
  formatters.forEach((formatter) => {
    formattedTokens += formatter.convert(basicTokensByCategory);
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
