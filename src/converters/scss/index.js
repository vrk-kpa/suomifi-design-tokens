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
      case 'radiuses':
        resultArray.push(...formatSpacingToScss(category.tokens, scssPrefix));
        break;
      case 'transitions':
        resultArray.push(
          ...formatTransitionToScss(category.tokens, scssPrefix),
        );
        break;
      case 'gradients':
        resultArray.push(...formatGradientToScss(category.tokens, scssPrefix));
        break;
      case 'shadows':
        resultArray.push(...formatShadowToScss(category.tokens, scssPrefix));
        break;
      case 'focuses':
        resultArray.push(...formatFocusToScss(category.tokens, scssPrefix));
        break;
      case 'breakpoints':
        resultArray.push(...formatSpacingToScss(category.tokens, scssPrefix));
        break;
      default:
        console.warn(
          `SCSS formatting: Unrecognized category type ${category.category}`,
        );
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
          token.value.lineHeight.unit !== null
            ? token.value.lineHeight.unit
            : ''
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

function formatTransitionToScss(tokens, scssPrefix) {
  return tokens.map((token) => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name,
    )}: ${token.value.value};`;
  });
}

function formatGradientToScss(tokens, scssPrefix) {
  return tokens.map((token) => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name,
    )}: ${token.value.value};`;
  });
}

function formatShadowToScss(tokens, scssPrefix) {
  return tokens.map((token) => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name,
    )}: ${token.value.value};`;
  });
}

function formatFocusToScss(tokens, scssPrefix) {
  return tokens.map((token) => {
    let scssString = `@mixin ${scssPrefix}-${
      token.prefix
    }-${convertCamelCaseToKebabCase(token.name)} {`;

    if (token.wrapper) {
      scssString += `${token.wrapper} {`;
    }

    if (token.value.content) {
      scssString += `content: ${token.value.content};`;
    }
    if (token.value.position) {
      scssString += `position: ${token.value.position};`;
    }
    if (token.value.pointerEvents) {
      scssString += `pointer-events: ${token.value.pointerEvents};`;
    }
    if (token.value.top) {
      scssString += `top: ${token.value.top.value}${
        token.value.top.unit !== null ? token.value.top.unit : ''
      };`;
    }
    if (token.value.right) {
      scssString += `right: ${token.value.right.value}${
        token.value.right.unit !== null ? token.value.right.unit : ''
      };`;
    }
    if (token.value.bottom) {
      scssString += `bottom: ${token.value.bottom.value}${
        token.value.bottom.unit !== null ? token.value.bottom.unit : ''
      };`;
    }
    if (token.value.left) {
      scssString += `left: ${token.value.left.value}${
        token.value.left.unit !== null ? token.value.left.unit : ''
      };`;
    }
    if (token.value.borderRadius) {
      scssString += `border-radius: ${token.value.borderRadius};`;
    }
    if (token.value.backgroundColor) {
      scssString += `background-color: ${token.value.backgroundColor};`;
    }
    if (token.value.border) {
      scssString += `border: ${token.value.border};`;
    }
    if (token.value.boxSizing) {
      scssString += `box-sizing: ${token.value.boxSizing};`;
    }
    if (token.value.boxShadow) {
      scssString += `box-shadow: ${token.value.boxShadow};`;
    }
    if (token.value.zIndex) {
      scssString += `z-index: ${token.value.zIndex};`;
    }
    if (token.value.outline) {
      scssString += `outline: ${token.value.outline};`;
    }
    if (token.value.after) {
      scssString += `&:after {${token.value.after}}`;
    }

    if (token.wrapper) {
      scssString += '}';
    }
    scssString += '}';
    return scssString;
  });
}

function convertCamelCaseToKebabCase(string) {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

module.exports.format = 'scss';

module.exports.convert = convertTokensToSCSS;
