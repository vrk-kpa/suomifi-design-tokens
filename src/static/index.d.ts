import {
  DesignTokens,
  ColorDesignTokens,
  TypographyDesignTokens,
  SpacingDesignTokens,
  RawDesignTokens,
  RawColorDesignTokens,
  RawTypographyDesignTokens,
  RawSpacingDesignTokens,
  ColorToken,
  TypographyToken,
  ValueUnit,
} from './interfaces';

declare module 'suomifi-design-tokens' {
  declare const rawSuomifiDesignTokens: RawDesignTokens;
  declare const suomifiDesignTokens: DesignTokens;
  export {
    tokens,
    DesignTokens,
    ColorDesignTokens,
    TypographyDesignTokens,
    SpacingDesignTokens,
    RawDesignTokens,
    RawColorDesignTokens,
    RawTypographyDesignTokens,
    RawSpacingDesignTokens,
    ColorToken,
    TypographyToken,
    ValueUnit,
  };
}
