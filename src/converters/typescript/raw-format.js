module.exports = function convertTokensToTS(
  tokensByCategory,
  tokensInterfaceName,
  exportObjectName,
) {
  return (
    formatToRawTS(tokensByCategory, tokensInterfaceName, exportObjectName) +
    '\n\n' +
    generateTSInterfaces(tokensByCategory)
  );
};

function formatToRawTS(
  tokensByCategory,
  tokensInterfaceName,
  exportObjectName,
) {
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
  return `const ${exportObjectName}: ${tokensInterfaceName} = ${JSON.stringify(
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

function generateTSInterfaces(tokensByCategory) {
  const interfaceExport = Object.entries(tokensByCategory).reduce(
    (resultArray, [key, value]) => {
      switch (value.category) {
        case 'colors': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawColorDesignTokens',
              'ColorToken',
            ),
          );
          return resultArray;
        }
        case 'typography': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawTypographyDesignTokens',
              'TypographyToken',
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
  return interfaceExport.join('');
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
