const scssPrefix = 'fi';

function convertTokensToSCSS(tokensByCategory) {
  return formatToScss(tokensByCategory, scssPrefix).join('');
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
  return tokens.map((token) => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name,
    )}: hsl(${token.value.h}, ${token.value.s}%, ${token.value.l}%);`;
  });
}

function formatTypographyToScss(tokens, scssPrefix) {
  return tokens.map((token) => {
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
  return tokens.map((token) => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name,
    )}: ${token.value.value + token.value.unit};`;
  });
}

function convertCamelCaseToKebabCase(string) {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

module.exports.format = 'scss';

module.exports.convert = convertTokensToSCSS;
