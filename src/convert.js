#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const program = require('commander');

const tokensData = require('./tokens.json');
require.extensions['.template'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const scssPrefix = 'fi';
const rawTokensInterfaceName = 'RawDesignTokens'; // interface name for object format tokens matching the template
const tokensInterfaceName = 'DesignTokens'; // interface name matching the template
const staticInterfaces = require('./interfaces.ts.template');
const outFileName = 'tokens';
const outFileTSName = 'index';

function main() {
  try {
    program
      .option('--outdir <outdir>', 'output directory')
      .option('--format <format>', 'format to output') // supports only scss and ts
      .parse(process.argv);
    const tokensByCategory = getTokensByCategory(tokensData, tokensData.tokens);
    if (program.format.includes('scss')) {
      exportToScss(tokensByCategory, scssPrefix, program.outdir, outFileName);
    }
    if (program.format.includes('ts')) {
      exportToTS(
        tokensByCategory,
        staticInterfaces,
        program.outdir,
        outFileTSName,
        tokensInterfaceName,
        rawTokensInterfaceName,
      );
    }
  } catch (err) {
    console.warn(err);
  }
}

function getTokensByCategory(tokensData, tokens) {
  return Object.entries(tokensData.categories).map(([key, category]) => {
    return {
      category: key,
      prefix: category.tokenPrefix,
      tokens: getCategoryTokens(key, category.tokenPrefix, tokens),
    };
  });
}

function getCategoryTokens(name, prefix, tokens) {
  return Object.entries(tokens).reduce((resultArray, [key, token]) => {
    if (token.category === name) {
      resultArray.push({
        ...token,
        name: key,
        prefix: `${prefix}`,
      });
    }
    return resultArray;
  }, []);
}

function exportToScss(tokensByCategory, scssPrefix, outDir, outFileName) {
  const scssExportData = formatToScss(tokensByCategory, scssPrefix);
  exportFile(`${outDir}`, `${outFileName}.scss`, scssExportData.join(''));
}

function formatToScss(tokensByCategory, scssPrefix) {
  return tokensByCategory.reduce((resultArray, category) => {
    switch (category.category) {
      case 'colors':
        resultArray.push(...formatColorsToScss(category.tokens, scssPrefix));
        break;
      case 'typography':
        resultArray.push(
          ...formatTypographyToScss(category.tokens, scssPrefix),
        );
        break;
      case 'spacing':
        resultArray.push(...formatSpacingToScss(category.tokens, scssPrefix));
        break;
      default:
        console.warn('Unrecognized category type');
    }
    return resultArray;
  }, []);
}

function formatColorsToScss(tokens, scssPrefix) {
  return tokens.map(token => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name,
    )}: hsl(${token.value.h}, ${token.value.s}%, ${token.value.l}%);`;
  });
}

function formatTypographyToScss(tokens, scssPrefix) {
  return tokens.map(token => {
    return `@mixin ${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name,
    )} {
      font-family: '${token.value.fontFamily.join("', '")}', ${
      token.value.genericFontFamily
    };
      font-size: ${token.value.fontSize.value}${
      token.value.fontSize.unit !== null ? token.value.fontSize.unit : ''
    };
      line-height: ${token.value.lineHeight.value}${
      token.value.lineHeight.unit !== null ? token.value.lineHeight.unit : ''
    };
      font-weight: ${token.value.fontWeight};
    }`;
  });
}

function formatSpacingToScss(tokens, scssPrefix) {
  return tokens.map(token => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name,
    )}: ${token.value.value + token.value.unit};`;
  });
}

function convertCamelCaseToKebabCase(string) {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

function exportToTS(
  tokensByCategory,
  staticInterfaces,
  outDir,
  outFileName,
  tokensInterfaceName,
  rawTokensInterfaceName,
) {
  /** Export tokens in TS format for css-in-js / tokens as strings */
  const tSExport = formatToTS(tokensByCategory, tokensInterfaceName);
  /** Export tokens in TS format without string conversion / tokens are objects with value and unit etc. */
  const rawTSExport = formatToRawTS(tokensByCategory, rawTokensInterfaceName);
  const typesExport = generateTSInterfaces(tokensByCategory, staticInterfaces);
  exportFile(
    `${outDir}`,
    `${outFileName}.ts`,
    typesExport + '\n\n' + rawTSExport + '\n\n' + tSExport,
  );
}

function formatToRawTS(tokensByCategory, tokensInterfaceName) {
  const tSExport = Object.assign(
    {},
    ...tokensByCategory.reduce((resultArray, category) => {
      switch (category.category) {
        case 'colors':
          resultArray.push({ colors: formatColorsToTS(category.tokens) });
          break;
        case 'typography':
          resultArray.push({
            typography: formatTypographyToTS(category.tokens),
          });
          break;
        case 'spacing':
          resultArray.push({ spacing: formatSpacingToTS(category.tokens) });
          break;
        default:
          console.warn('Unrecognized category type');
      }
      return resultArray;
    }, []),
  );
  return `export const rawSuomifiDesignTokens: ${tokensInterfaceName} = ${JSON.stringify(
    tSExport,
  )}`;
}

function formatColorsToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      return {
        [token.name]: {
          hsl: `hsl(${token.value.h}, ${token.value.s}%, ${token.value.l}%)`,
          h: token.value.h,
          s: token.value.s,
          l: token.value.l,
        },
      };
    }),
  );
}

function formatTypographyToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      return {
        [token.name]: {
          fontFamily: `${token.value.fontFamily
            .map(font => `'${font}', `)
            .join('')}${token.value.genericFontFamily}`,
          fontSize: token.value.fontSize,
          lineHeight: token.value.lineHeight,
          fontWeight: token.value.fontWeight,
        },
      };
    }),
  );
}

function formatSpacingToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      return {
        [token.name]: token.value,
      };
    }),
  );
}

function formatToTS(tokensByCategory, tokensInterfaceName) {
  const tSExport = Object.assign(
    {},
    ...tokensByCategory.reduce((resultArray, category) => {
      switch (category.category) {
        case 'colors':
          resultArray.push({
            colors: formatValueUnitTokensToString(category.tokens),
          });
          break;
        case 'typography':
          resultArray.push({
            typography: formatTypographyToString(category.tokens),
          });
          break;
        case 'spacing':
          resultArray.push({
            spacing: formatValueUnitTokensToString(category.tokens),
          });
          break;
        default:
          console.warn('Unrecognized category type');
      }
      return resultArray;
    }, []),
  );
  return `export const suomifiDesignTokens: ${tokensInterfaceName} = ${JSON.stringify(
    tSExport,
  )}`;
}

function formatValueUnitTokensToString(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      const obj = {
        [token.name]:
          (token.type === 'hsl'
            ? `hsl(${token.value.h}, ${token.value.s}%, ${token.value.l}%)`
            : token.value.value) + (!!token.value.unit ? token.value.unit : ''),
      };
      return obj;
    }),
  );
}

function formatColorsToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      return {
        [token.name]: {
          hsl: `hsl(${token.value.h}, ${token.value.s}%, ${token.value.l}%)`,
          h: token.value.h,
          s: token.value.s,
          l: token.value.l,
        },
      };
    }),
  );
}

function formatTypographyToString(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      const fontFamily = `${token.value.fontFamily
        .map(font => `'${font}', `)
        .join('')}${token.value.genericFontFamily}`;
      const fontSize = `${token.value.fontSize.value +
        (!!token.value.fontSize.unit ? token.value.fontSize.unit : '')}`;
      const lineHeight = `${token.value.lineHeight.value +
        (!!token.value.lineHeight.unit ? token.value.lineHeight.unit : '')}`;
      return {
        [token.name]: `font-family: ${fontFamily}; font-size: ${fontSize}; line-height: ${lineHeight}; fontWeight: ${token.value.fontWeight};`,
      };
    }),
  );
}

function generateTSInterfaces(tokensByCategory, staticInterfaces) {
  const interfaceExport = Object.entries(tokensByCategory).reduce(
    (resultArray, [key, value]) => {
      switch (value.category) {
        case 'colors': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawColorDesignTokens',
              'RawColorToken',
            ),
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'ColorDesignTokens',
            ),
          );
          return resultArray;
        }
        case 'typography': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawTypographyDesignTokens',
              'RawTypographyToken',
            ),
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'TypographyDesignTokens',
            ),
          );
          return resultArray;
        }
        case 'spacing': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawSpacingDesignTokens',
              'ValueUnit',
            ),
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'SpacingDesignTokens',
            ),
          );
          return resultArray;
        }
        default: {
          console.warn('Unrecognized category type');
          return resultArray;
        }
      }
    },
    [],
  );
  return staticInterfaces + interfaceExport.join('');
}

function generateTSInterfaceCategory(
  tokens,
  categoryInterfaceName,
  cateogryPropertyInterfaceName,
) {
  return [
    `export interface ${categoryInterfaceName} {`,
    ...generateTSInterfaceProperties(tokens, cateogryPropertyInterfaceName),
    '}',
  ];
}

function generateTSInterfaceProperties(tokens, interfaceName) {
  return tokens.map(token => {
    return `${token.name}: ${interfaceName};`;
  });
}

function generateTSStringInterfaceCatergory(tokens, categoryInterfaceName) {
  return [
    `export interface ${categoryInterfaceName} {`,
    ...tokens.map(token => `${token.name}: string;`),
    '}',
  ];
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
