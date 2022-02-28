module.exports = function convertTokensToTS(
  tokensByCategory,
  tokensInterfaceName,
  exportObjectName,
) {
  return (
    formatToTS(tokensByCategory, tokensInterfaceName, exportObjectName) +
    '\n\n' +
    generateTSInterfaces(tokensByCategory)
  );
};

function formatToTS(tokensByCategory, tokensInterfaceName, exportObjectName) {
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
  ).slice(0, -1)},
    values: ${exportObjectName}}`;
}

function formatValueUnitTokensToString(tokens) {
  return Object.assign(
    {},
    ...tokens.map((token) => {
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
    ...tokens.map((token) => {
      const fontFamily = `${token.value.fontFamily
        .map((font) => `'${font}', `)
        .join('')}${token.value.genericFontFamily}`;
      const fontSize = `${
        token.value.fontSize.value +
        (!!token.value.fontSize.unit ? token.value.fontSize.unit : '')
      }`;
      const lineHeight = `${
        token.value.lineHeight.value +
        (!!token.value.lineHeight.unit ? token.value.lineHeight.unit : '')
      }`;
      return {
        [token.name]: `font-family: ${fontFamily}; font-size: ${fontSize}; line-height: ${lineHeight}; font-weight: ${token.value.fontWeight};`,
      };
    }),
  );
}

function generateTSInterfaces(tokensByCategory) {
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
  return interfaceExport.join('');
}

function generateTSStringInterfaceCatergory(tokens, categoryInterfaceName) {
  return [
    `export interface ${categoryInterfaceName} {`,
    ...tokens.map((token) => `${token.name}: string;`),
    '}',
  ];
}
