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
        case 'radiuses':
          resultArray.push({ radiuses: formatSpacingToTS(category.tokens) });
          break;
        case 'transitions':
          resultArray.push({
            transitions: formatTransitionToTS(category.tokens),
          });
          break;
        case 'gradients':
          resultArray.push({ gradients: formatGradientToTS(category.tokens) });
          break;
        case 'shadows':
          resultArray.push({ shadows: formatShadowToTS(category.tokens) });
          break;
        case 'focuses':
          resultArray.push({ focuses: formatFocusToTS(category.tokens) });
          break;
        default:
          console.warn(
            `Raw formatting: Unrecognized category type ${category.category}`,
          );
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
    ...tokens.map((token) => {
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
    ...tokens.map((token) => {
      return {
        [token.name]: {
          fontFamily: `${token.value.fontFamily
            .map((font) => `'${font}', `)
            .join('')}${token.value.genericFontFamily}`,
          fontSize: token.value.fontSize,
          lineHeight: token.value.lineHeight,
          fontWeight: token.value.fontWeight,
        },
      };
    }),
  );
}

function formatFocusToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map((token) => {
      const obj = {};

      if (token.wrapper) {
        obj.wrapper = token.wrapper;
      }

      if (token.value.content) {
        obj.content = token.value.content;
      }
      if (token.value.position) {
        obj.position = token.value.position;
      }
      if (token.value.pointerEvents) {
        obj.pointerEvents = token.value.pointerEvents;
      }
      if (token.value.top) {
        obj.top = token.value.top;
      }
      if (token.value.right) {
        obj.right = token.value.right;
      }
      if (token.value.bottom) {
        obj.bottom = token.value.bottom;
      }
      if (token.value.left) {
        obj.left = token.value.left;
      }
      if (token.value.borderRadius) {
        obj.borderRadius = token.value.borderRadius;
      }
      if (token.value.backgroundColor) {
        obj.backgroundColor = token.value.backgroundColor;
      }
      if (token.value.border) {
        obj.border = token.value.border;
      }
      if (token.value.boxSizing) {
        obj.boxSizing = token.value.boxSizing;
      }
      if (token.value.boxShadow) {
        obj.boxShadow = token.value.boxShadow;
      }
      if (token.value.zIndex) {
        obj.zIndex = token.value.zIndex;
      }
      if (token.value.outline) {
        obj.outline = token.value.outline;
      }
      if (token.value.after) {
        obj.after = token.value.after;
      }

      return { [token.name]: obj };
    }),
  );
}

function formatSpacingToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map((token) => {
      return {
        [token.name]: token.value,
      };
    }),
  );
}

function formatTransitionToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map((token) => {
      return {
        [token.name]: token.value,
      };
    }),
  );
}

function formatGradientToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map((token) => {
      return {
        [token.name]: token.value,
      };
    }),
  );
}

function formatShadowToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map((token) => {
      return {
        [token.name]: token.value,
      };
    }),
  );
}

function formatColorsToTS(tokens) {
  return Object.assign(
    {},
    ...tokens.map((token) => {
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
        case 'radiuses': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawRadiusDesignTokens',
              'ValueUnit',
            ),
          );
          return resultArray;
        }
        case 'transitions': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawTransitionDesignTokens',
              'ValueUnit',
            ),
          );
          return resultArray;
        }
        case 'gradients': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawGradientDesignTokens',
              'ValueUnit',
            ),
          );
          return resultArray;
        }
        case 'shadows': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawShadowDesignTokens',
              'ValueUnit',
            ),
          );
          return resultArray;
        }
        case 'focuses': {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              'RawFocusDesignTokens',
              'FocusToken',
            ),
          );
          return resultArray;
        }
        default: {
          console.warn(
            `Raw formatting TS interface: Unrecognized category type ${value.category}`,
          );
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
    '} \n',
  ];
}

function generateTSInterfaceProperties(tokens, interfaceName) {
  return tokens.map((token) => {
    return `${token.name}: ${interfaceName};`;
  });
}
