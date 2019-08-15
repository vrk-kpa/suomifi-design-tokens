#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");

const tokensData = require("./tokens.json");
const outDir = __dirname + "/../dist/";
const outFileName = "tokens";

function main() {
  try {
    let tokensByCategory = getTokensByCategory(tokensData);
    let resolvedTokensByCategory = resolveCategoryDataForTokens(
      tokensByCategory,
      tokensData.tokens
    );
    exportToScss(resolvedTokensByCategory, outDir, outFileName);
  } catch (err) {
    console.warn(err);
  }
}

function getTokensByCategory(tokensData) {
  return Object.keys(tokensData.categories).map(key => {
    return {
      category: key,
      prefix: tokensData.categories[key].tokenPrefix,
      tokens: []
    };
  });
}

function resolveCategoryDataForTokens(tokensByCategory, tokens) {
  return tokensByCategory.map(category => {
    Object.keys(tokens).forEach(key => {
      if (tokens[key].category === category.category) {
        tokens[key].name = key;
        tokens[key].prefix = `${category.prefix}`;
        category.tokens.push(tokens[key]);
      }
    });
    return category;
  });
}

function exportToScss(resolvedTokensByCategory, outDir, outFileName) {
  const scssExportData = formatToScss(resolvedTokensByCategory);
  exportFile(`${outDir}`, `${outFileName}.scss`, scssExportData);
}

function formatToScss(resolvedTokensByCategory) {
  let scssExport = [];
  resolvedTokensByCategory.forEach(category => {
    switch (category.category) {
      case "colors":
        scssExport.push(...formatColorsToScss(category.tokens));
        break;
      case "typography":
        scssExport.push(...formatTypographyToScss(category.tokens));
        break;
      case "spacing":
        scssExport.push(...formatSpacingToScss(category.tokens));
        break;
      default:
        console.warn("Unrecognized category type");
    }
  });
  return scssExport.join("\n");
}

function formatColorsToScss(tokens) {
  return tokens.map(token => {
    return `$${token.prefix}-${convertCamelCaseToKebabCase(token.name)}: hsl(${
      token.value.h
    }, ${token.value.s}%, ${token.value.l}%);`;
  });
}

function formatTypographyToScss(tokens) {
  return tokens.map(token => {
    return `@mixin ${token.prefix}_${convertCamelCaseToKebabCase(token.name)} {
      font-family: "${token.value.fontFamily.join(", ")}";
      font-size: "${token.value.fontSize.value}${
      token.value.fontSize.unit !== null ? token.value.fontSize.unit : ""
    }";
      line-height: "${token.value.lineHeight.value}${
      token.value.lineHeight.unit !== null ? token.value.lineHeight.unit : ""
    }";
    }`;
  });
}

function formatSpacingToScss(tokens) {
  return tokens.map(token => {
    return `$${token.prefix}_${convertCamelCaseToKebabCase(
      token.name
    )}: "${token.value.value + token.value.unit}";`;
  });
}

function convertCamelCaseToKebabCase(string) {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

function exportFile(outDir, fileName, data) {
  try {
    if (!fs.existsSync(path.dirname(outDir))) {
      fs.mkdirSync(outDir);
    }
    fs.writeFile(`${outDir}/${fileName}`, data, err => {
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
