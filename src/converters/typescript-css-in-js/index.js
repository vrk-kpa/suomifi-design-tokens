const fs = require('fs');
const tokensInterfaceName = 'DesignTokens'; // interface name matching the template
require.extensions['.template'] = function(module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const staticInterfaces = require('./interfaces.ts.template');

function convertTokensToCssInJS(tokensByCategory) {
  return (
    formatToTS(tokensByCategory, tokensInterfaceName) +
    '\n\n' +
    generateTSInterfaces(tokensByCategory, staticInterfaces)
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
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'ColorDesignTokens',
            ),
          );
          return resultArray;
        }
        case 'typography': {
          resultArray.push(
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'TypographyDesignTokens',
            ),
          );
          return resultArray;
        }
        case 'spacing': {
          resultArray.push(
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

function generateTSStringInterfaceCatergory(tokens, categoryInterfaceName) {
  return [
    `export interface ${categoryInterfaceName} {`,
    ...tokens.map(token => `${token.name}: string;`),
    '}',
  ];
}

module.exports.format = 'ts';
module.exports.convert = convertTokensToCssInJS;
