#!/usr/bin/env node
"use strict";

const path = require("path");
const fs = require("fs");
const program = require("commander");

const tokensData = require("./tokens.json");
require.extensions[".template"] = function(module, filename) {
  module.exports = fs.readFileSync(filename, "utf8");
};
const scssPrefix = "fi";
const staticInterfaces = require("./interfaces.ts.template");
const outFileName = "tokens";
const outFileJSName = "index";
const interfacesOutFileName = "interfaces.d.ts";

function main() {
  try {
    program
      .option("--outdir <outdir>", "output directory")
      .option("--format <format>", "format to output") // supports only scss and js
      .parse(process.argv);
    const tokensByCategory = getTokensByCategory(tokensData, tokensData.tokens);
    if (program.format.includes("scss")) {
      exportToScss(tokensByCategory, scssPrefix, program.outdir, outFileName);
    }
    if (program.format.includes("js")) {
      exportToJS(
        tokensByCategory,
        staticInterfaces,
        program.outdir,
        outFileJSName,
        interfacesOutFileName
      );
    }
  } catch (err) {
    console.warn(err);
  }
}

function getTokensByCategory(tokensData, tokens) {
  return Object.entries(tokensData.categories).map(([key, category]) => {
    return {
      category: key,
      prefix: category.tokenPrefix,
      tokens: getCategoryTokens(key, category.tokenPrefix, tokens)
    };
  });
}

function getCategoryTokens(name, prefix, tokens) {
  return Object.entries(tokens).reduce((resultArray, [key, token]) => {
    if (token.category === name) {
      resultArray.push({
        ...token,
        name: key,
        prefix: `${prefix}`
      });
    }
    return resultArray;
  }, []);
}

function exportToScss(tokensByCategory, scssPrefix, outDir, outFileName) {
  const scssExportData = formatToScss(tokensByCategory, scssPrefix);
  exportFile(`${outDir}`, `${outFileName}.scss`, scssExportData.join(""));
}

function formatToScss(tokensByCategory, scssPrefix) {
  return tokensByCategory.reduce((resultArray, category) => {
    switch (category.category) {
      case "colors":
        resultArray.push(...formatColorsToScss(category.tokens, scssPrefix));
        break;
      case "typography":
        resultArray.push(
          ...formatTypographyToScss(category.tokens, scssPrefix)
        );
        break;
      case "spacing":
        resultArray.push(...formatSpacingToScss(category.tokens, scssPrefix));
        break;
      default:
        console.warn("Unrecognized category type");
    }
    return resultArray;
  }, []);
}

function formatColorsToScss(tokens, scssPrefix) {
  return tokens.map(token => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name
    )}: hsl(${token.value.h}, ${token.value.s}%, ${token.value.l}%);`;
  });
}

function formatTypographyToScss(tokens, scssPrefix) {
  return tokens.map(token => {
    return `@mixin ${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name
    )} {
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

function formatSpacingToScss(tokens, scssPrefix) {
  return tokens.map(token => {
    return `$${scssPrefix}-${token.prefix}-${convertCamelCaseToKebabCase(
      token.name
    )}: "${token.value.value + token.value.unit}";`;
  });
}

function convertCamelCaseToKebabCase(string) {
  return string.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
}

function exportToJS(
  tokensByCategory,
  staticInterfaces,
  outDir,
  outFileName,
  interfacesOutFileName
) {
  const jSExport = formatToJS(tokensByCategory);
  const typesExport = generateTSInterfaces(tokensByCategory, staticInterfaces);
  exportFile(`${outDir}`, `${outFileName}.js`, jSExport);
  exportFile(`${outDir}`, interfacesOutFileName, typesExport);
}

function formatToJS(tokensByCategory) {
  const jSExport = Object.assign(
    {},
    ...tokensByCategory.reduce((resultArray, category) => {
      switch (category.category) {
        case "colors":
          resultArray.push({ colors: formatColorsToJS(category.tokens) });
          break;
        case "typography":
          resultArray.push({
            typography: formatTypographyToJS(category.tokens)
          });
          break;
        case "spacing":
          resultArray.push({ spacing: formatSpacingToJS(category.tokens) });
          break;
        default:
          console.warn("Unrecognized category type");
      }
      return resultArray;
    }, [])
  );
  return "export const tokens = " + JSON.stringify(jSExport);
}

function formatColorsToJS(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      return {
        [token.name]: {
          hsl: `hsl(${token.value.h}, ${token.value.s}%, ${token.value.l}%)`,
          h: token.value.h,
          s: token.value.s,
          l: token.value.l
        }
      };
    })
  );
}

function formatTypographyToJS(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      return {
        [token.name]: token.value
      };
    })
  );
}

function formatSpacingToJS(tokens) {
  return Object.assign(
    {},
    ...tokens.map(token => {
      return {
        [token.name]: token.value
      };
    })
  );
}

function generateTSInterfaces(tokensByCategory, staticInterfaces) {
  const interfaceExport = Object.entries(tokensByCategory).reduce(
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
  return staticInterfaces + interfaceExport.join("");
}

function generateTSInterfaceCategory(
  tokens,
  categoryInterfaceName,
  cateogryPropertyInterfaceName
) {
  return [
    `export interface ${categoryInterfaceName} {`,
    ...generateTSInterfaceProperties(tokens, cateogryPropertyInterfaceName),
    "}"
  ];
}

function generateTSInterfaceProperties(tokens, interfaceName) {
  return tokens.map(token => {
    return `${token.name}: ${interfaceName};`;
  });
}

function exportFile(outDir, fileName, data) {
  const dirname = path.normalize(outDir);
  try {
    if (!fs.existsSync(dirname)) {
      fs.mkdirSync(dirname);
    }
    fs.writeFile(path.join(dirname, fileName), data, err => {
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
