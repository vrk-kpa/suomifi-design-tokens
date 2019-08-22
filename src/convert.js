#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");
const program = require("commander");

const tokensData = require("./tokens.json");
require.extensions[".template"] = function(module, filename) {
  module.exports = fs.readFileSync(filename, "utf8");
};
const staticInterfaces = require("./interfaces.ts.template");
const outFileName = "tokens";
const interfacesOutFileName = "interfaces.d.ts";

function main() {
  try {
    program
      .option(
        "--outdir <outdir>",
        "output directory",
        `${path.join(process.cwd(), "dist")}`
      )
      .option("--format <format>", "format to output", ["scss", "js"])
      .parse(process.argv);
    let tokensByCategory = getTokensByCategory(tokensData);
    let resolvedTokensByCategory = resolveCategoryDataForTokens(
      tokensByCategory,
      tokensData.tokens
    );
    if (program.format.includes("scss")) {
      exportToScss(resolvedTokensByCategory, program.outdir, outFileName);
    }
    if (program.format.includes("js")) {
      exportToJS(
        resolvedTokensByCategory,
        staticInterfaces,
        program.outdir,
        outFileName,
        interfacesOutFileName
      );
    }
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
    return `@mixin ${token.prefix}-${convertCamelCaseToKebabCase(token.name)} {
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
    return `$${token.prefix}-${convertCamelCaseToKebabCase(
      token.name
    )}: "${token.value.value + token.value.unit}";`;
  });
}

function convertCamelCaseToKebabCase(string) {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

function exportToJS(
  resolvedTokensByCategory,
  staticInterfaces,
  outDir,
  outFileName,
  interfacesOutFileName
) {
  const jSExport = formatToJS(resolvedTokensByCategory);
  const typesExport = generateTSInterfaces(
    resolvedTokensByCategory,
    staticInterfaces
  );
  exportFile(`${outDir}`, `${outFileName}.js`, jSExport);
  exportFile(`${outDir}`, interfacesOutFileName, typesExport);
}

function formatToJS(resolvedTokensByCategory) {
  let jSExport = {};
  resolvedTokensByCategory.forEach(category => {
    switch (category.category) {
      case "colors":
        jSExport.colors = formatColorsToJS(category.tokens);
        break;
      case "typography":
        jSExport.typograhphy = formatTypographyToJS(category.tokens);
        break;
      case "spacing":
        jSExport.spacing = formatSpacingToJS(category.tokens);
        break;
      default:
        console.warn("Unrecognized category type");
    }
  });
  return `module.exports = ` + JSON.stringify(jSExport);
}

function formatColorsToJS(tokens) {
  let colors = {};
  tokens.forEach(token => {
    colors[token.name] = {
      hsl: `hsl(${token.value.h}, ${token.value.s}%, ${token.value.l}%)`,
      h: token.value.h,
      s: token.value.s,
      l: token.value.l
    };
  });
  return colors;
}

function formatTypographyToJS(tokens) {
  let typograhphy = {};
  tokens.forEach(token => {
    typograhphy[token.name] = token.value;
  });
  return typograhphy;
}

function formatSpacingToJS(tokens) {
  let spacing = {};
  tokens.forEach(token => {
    spacing[token.name] = token.value;
  });
  return spacing;
}

function generateTSInterfaces(resolvedTokensByCategory, staticInterfaces) {
  const interfaceExport = Object.entries(resolvedTokensByCategory).reduce(
    (resultArray, [key, value]) => {
      switch (value.category) {
        case "colors": {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              "ColorDesingTokens",
              "ColorToken"
            )
          );
          return resultArray;
        }
        case "typography": {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              "TypograhpyDesingTokens",
              "TypographyToken"
            )
          );
          return resultArray;
        }
        case "spacing": {
          resultArray.push(
            ...generateTSInterfaceCategory(
              value.tokens,
              "SpacingDesingTokens",
              "ValueUnit"
            )
          );
          return resultArray;
        }
        default: {
          console.warn("Unrecognized category type");
          return resultArray;
        }
      }
    },
    []
  );
  return staticInterfaces + "\n" + interfaceExport.join("");
}

function generateTSInterfaceCategory(
  tokens,
  categoryInterfaceName,
  cateogryPropertyInterfaceName
) {
  return [
    `export interface ${categoryInterfaceName} {\n`,
    ...generateTSInterfaceProperties(tokens, cateogryPropertyInterfaceName),
    "}\n\n"
  ];
}

function generateTSInterfaceProperties(tokens, interfaceName) {
  let interfaceProperties = [];
  tokens.forEach(token => {
    interfaceProperties.push(`  ${token.name}: ${interfaceName};\n`);
  });
  return interfaceProperties;
}

function exportFile(outDir, fileName, data) {
  const dirname = path.normalize(outDir);
  try {
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }
    fs.writeFile(`${path.join(dirname, fileName)}`, data, err => {
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
