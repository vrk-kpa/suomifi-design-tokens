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
  declare const tokens: DesignTokens;
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
