import {
  DesignTokens,
  ColorDesignTokens,
  TypographyDesignTokens,
  SpacingDesignTokens,
  ColorToken,
  TypographyToken,
  ValueUnit,
} from './interfaces';

declare module 'suomifi-design-tokens' {
  declare const tokens: DesignTokens;
  export {
    tokens,
    DesignTokens,
    ColorDesignTokens,
    TypographyDesignTokens,
    SpacingDesignTokens,
    ColorToken,
    TypographyToken,
    ValueUnit,
  };
}
