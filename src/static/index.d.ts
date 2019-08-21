import * as originalTokens from "./tokens.js";

declare module "suomifi-design-tokens" {
  type DesignTokens = typeof originalTokens;
  const tokens: DesignTokens = originalTokens;
  export { tokens };
}
