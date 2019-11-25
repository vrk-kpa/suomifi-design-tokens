const fs = require('fs');
const rawTokensInterfaceName = 'RawDesignTokens'; // interface name for object format tokens matching the template
require.extensions['.template'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const staticInterfaces = require('./interfaces.ts.template');

function convertTokensToTS(tokensByCategory) {
  return (
    formatToRawTS(tokensByCategory, rawTokensInterfaceName) +
    '\n\n' +
    generateTSInterfaces(tokensByCategory, staticInterfaces)
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

module.exports.format = 'ts';
module.exports.convert = convertTokensToTS;
