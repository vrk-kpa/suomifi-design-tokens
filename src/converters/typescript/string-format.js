module.exports = function convertTokensToTS(
  tokensByCategory,
  tokensInterfaceName,
  exportObjectName,
) {
  return (
    formatToTS(tokensByCategory, tokensInterfaceName, exportObjectName) +
    '\n\n' +
    generateTSInterfaces(tokensByCategory) +
    '\n\n'
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
        case 'radiuses':
          resultArray.push({
            radiuses: formatValueUnitTokensToString(category.tokens),
          });
          break;
        case 'transitions':
          resultArray.push({
            transitions: formatValueUnitTokensToString(category.tokens),
          });
          break;
        case 'gradients':
          resultArray.push({
            gradients: formatValueUnitTokensToString(category.tokens),
          });
          break;
        case 'shadows':
          resultArray.push({
            shadows: formatValueUnitTokensToString(category.tokens),
          });
          break;
        case 'focuses':
          resultArray.push({
            focuses: formatFocusTokensToString(category.tokens),
          });
          break;
        default:
          console.warn(
            `String formatting: Unrecognized category type ${category.category}`,
          );
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

function formatFocusTokensToString(tokens) {
  return Object.assign(
    {},
    ...tokens.map((token) => {
      let tokenString = '';

      if (token.wrapper) {
        tokenString += `${token.wrapper} {`;
      }

      if (token.value.content) {
        tokenString += `content: ${token.value.content};`;
      }
      if (token.value.position) {
        tokenString += `position: ${token.value.position};`;
      }
      if (token.value.pointerEvents) {
        tokenString += `pointer-events: ${token.value.pointerEvents};`;
      }
      if (token.value.top) {
        tokenString += `top: ${token.value.top.value}${
          token.value.top.unit !== null ? token.value.top.unit : ''
        };`;
      }
      if (token.value.right) {
        tokenString += `right: ${token.value.right.value}${
          token.value.right.unit !== null ? token.value.right.unit : ''
        };`;
      }
      if (token.value.bottom) {
        tokenString += `bottom: ${token.value.bottom.value}${
          token.value.bottom.unit !== null ? token.value.bottom.unit : ''
        };`;
      }
      if (token.value.left) {
        tokenString += `left: ${token.value.left.value}${
          token.value.left.unit !== null ? token.value.left.unit : ''
        };`;
      }
      if (token.value.borderRadius) {
        tokenString += `border-radius: ${token.value.borderRadius};`;
      }
      if (token.value.backgroundColor) {
        tokenString += `background-color: ${token.value.backgroundColor};`;
      }
      if (token.value.border) {
        tokenString += `border: ${token.value.border};`;
      }
      if (token.value.boxSizing) {
        tokenString += `box-sizing: ${token.value.boxSizing};`;
      }
      if (token.value.boxShadow) {
        tokenString += `box-shadow: ${token.value.boxShadow};`;
      }
      if (token.value.zIndex) {
        tokenString += `z-index: ${token.value.zIndex};`;
      }
      if (token.value.outline) {
        tokenString += `outline: ${token.value.outline};`;
      }
      if (token.value.after) {
        tokenString += `&:after { ${token.value.after}}`;
      }

      if (token.wrapper) {
        tokenString += '}';
      }

      return { [token.name]: tokenString };
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
        case 'radiuses': {
          resultArray.push(
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'RadiusDesignTokens',
            ),
          );
          return resultArray;
        }
        case 'transitions': {
          resultArray.push(
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'TransitionDesignTokens',
            ),
          );
          return resultArray;
        }
        case 'gradients': {
          resultArray.push(
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'GradientDesignTokens',
            ),
          );
          return resultArray;
        }
        case 'shadows': {
          resultArray.push(
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'ShadowDesignTokens',
            ),
          );
          return resultArray;
        }
        case 'focuses': {
          resultArray.push(
            ...generateTSStringInterfaceCatergory(
              value.tokens,
              'FocusDesignTokens',
            ),
          );
          return resultArray;
        }
        default: {
          console.warn(
            `String formatting TS interface: Unrecognized category type ${value.category}`,
          );
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
    '} \n',
  ];
}
