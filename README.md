# Suomifi Design System Tokens

## ✨ Features

Suomifi Design System Tokens are available in SCSS and JavaScript formats. Typings for TypeScript are also available.

The following token types are currently available:

- colors
- typography
- spacing

# 📦 Install

```bash
yarn add suomifi-design-tokens
```

# 🔨 Usage

## SCSS

Tokens are available as named SCSS variables and mixins with **\$fi-** -prefix.
Tokens can be imported to scss files:

```scss
@import "~suomifi-desing-tokens/tokens";
```

### Colors

Color tokens are available as variables with additional **colors-** prefix. Colors are provided as hsl values.

```scss
.custom-class {
  background-color: $fi-color-brand-base;
}
```

### Typography

Typography tokens are available as mixins with additional **typograhpy-** -prefix.

```scss
h1 {
  @include fi-text-heading1;
}
```

### Spacing

Spacing tokens are availalbe as variables with additional **spacing-** -prefix.

```scss
.custom-class {
  margin: $fi-spacing-l;
}
```

## JavaScript and TypeScript

Tokens are available as named **tokens** export and can be imported to JavaScript and TypeScript files.

JavaScript example:

```js
import { tokens } from "suomifi-design-tokens";
```

TypeScript example with typings:

```ts
import { tokens } from "suomifi-design-tokens";
import { DesignTokens }
```

### Colors

Color tokens are available with **colors** property. Colors are provided as both separated h, s and l values and as combined hsl string.

JavaScript example:

```js
const brandBaseHsl = tokens.colors.brandBase.hsl;
```

TypeScript example with typings:

```ts
import { ColorToken } from "suomifi-desing-tokens";

const brandBase: ColorToken = tokens.colors.brandBase;
const brandBaseHsl: string = brandBase.hsl;
```

### Typography

Typography tokens are available with **typograhpy** property. Typography is provided with fontFamily, fontSize, lineHeight and fontWeight.

JavaScript example:

```js
const heading1 = tokens.typograhpy.heading1;
const heading1FontSize = heading1.fontSize.value + heading1.fontSize.unit;
const heading1FontFamily = Array.join(heading1.fontFamily);
```

TypeScript example with typings:

```ts
import { TypographyToken } from "suomifi-desing-tokens";

const heading1: TypographyToken = tokens.typography.heading1;
const heading1FontSize: string =
  heading1.fontSize.value + heading1.fontSize.unit;
const heading1FontFamily: string = Array.join(heading1.fontFamily);
```

### Spacing

Spacing tokens are availalbe with **spacing** property. Spacings are provided with numerical value and format string.

JavaScript example:

```js
const spacingL = tokens.spacing.l;
const spacingLWithUnit = spacingL.value + spacingL.unit;
```

TypeScript example with typings:

```ts
import { ValueUnit } from "suomifi-desing-tokens";

const spacingL: ValueUnit = tokens.spacing.l;
const spacingLWithUnit: string = spacingL.value + spacingL.unit;
```

## ⌨️ Development

See [DEVELOPMENT.md](/DEVELOPMENT.md).

## Licensing

MIT [LICENSE](/LICENSE)
