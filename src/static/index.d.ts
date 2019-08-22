import * as originalTokens from "./tokens.js";
import {
  DesignTokens,
  ColorDesingTokens,
  TypograhpyDesingTokens,
  SpacingDesingTokens,
  ColorToken,
  TypographyToken,
  ValueUnit
} from "./interfaces";

declare module "suomifi-design-tokens" {
  const tokens: DesignTokens = originalTokens;
  export {
    tokens,
    DesignTokens,
    ColorDesingTokens,
    TypograhpyDesingTokens,
    SpacingDesingTokens,
    ColorToken,
    TypographyToken,
    ValueUnit
  };
}
