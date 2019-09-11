# Suomifi Design System Tokens

The Design System Tokens repository contains color, typography and spacing definitions as tokens following the Suomi.fi-brand.

## ✨ Features

The design system tokens are available in SCSS and JavaScript formats. Typings for TypeScript are also available.

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

Tokens are available as named SCSS variables and mixins with **\$fi-** prefix. Tokens can be imported to scss files:

```scss
@import '~suomifi-design-tokens/dist/tokens';
```

### 🎨 Colors

Color tokens are available as variables with additional **colors-** prefix. Colors are provided as hsl values.

Example from **tokens.scss**:

```scss
$fi-color-brand-base: hsl(214, 100%, 24%);
```

Example use case:

```scss
.custom-class {
  background-color: $fi-color-brand-base;
}
```

### 🖋 Typography

Typography tokens are available as mixins with additional **typograhpy-** prefix.

Example from **tokens.scss**:

```scss
@mixin fi-text-heading1 {
  font-family: 'Source Sans Pro, Helvetica Neue, Arial, sans-serif';
  font-size: 40px;
  line-height: 48px;
}
```

Example use case:

```scss
h1 {
  @include fi-text-heading1;
}
```

### 📏 Spacing

Spacing tokens are available as variables with additional **spacing-** prefix.

Example from **tokens.scss**:

```scss
$fi-spacing-l: 32px;
```

Example use case:

```scss
.custom-class {
  margin: $fi-spacing-l;
}
```

## JavaScript and TypeScript

Tokens are available as named **tokens** export and can be imported to JavaScript and TypeScript files.

JavaScript example:

```js
import { tokens } from 'suomifi-design-tokens';
```

TypeScript example with typings:

```ts
import { tokens } from "suomifi-design-tokens";
import { DesignTokens }
```

### 🎨 Colors

Color tokens are available with **colors** property. Colors are provided as both separated h, s and l values and as combined hsl string.

Example from **tokens object**:

```js
exports.tokens = {
  colors: {
    whiteBase: { hsl: 'hsl(0, 0%, 100%)', h: 0, s: 0, l: 100 }
  }
};
```

JavaScript example:

```js
const brandBaseHsl = tokens.colors.brandBase.hsl;
```

TypeScript example with typings:

```ts
import { ColorToken } from 'suomifi-desing-tokens';

const brandBase: ColorToken = tokens.colors.brandBase;
const brandBaseHsl: string = brandBase.hsl;
```

### 🖋 Typography

Typography tokens are available with **typograhpy** property. Typography is provided with fontFamily, fontSize, lineHeight and fontWeight.

Example from **tokens object**:

```js
exports.tokens = {
  typography: {
    heading1: {
      fontFamily: [
        'Source Sans Pro',
        'Helvetica Neue',
        'Arial',
        'sans-serif'
      ],
      fontSize: { value: 40, unit: 'px' },
      lineHeight: { value: 48, unit: 'px' },
      fontWeight: 300
    }
  }
};
```

JavaScript example:

```js
const heading1 = tokens.typograhpy.heading1;
const heading1FontSize =
  heading1.fontSize.value + heading1.fontSize.unit;
const heading1FontFamily = Array.join(heading1.fontFamily);
```

TypeScript example with typings:

```ts
import { TypographyToken } from 'suomifi-desing-tokens';

const heading1: TypographyToken = tokens.typography.heading1;
const heading1FontSize: string =
  heading1.fontSize.value + heading1.fontSize.unit;
const heading1FontFamily: string = Array.join(heading1.fontFamily);
```

### 📏 Spacing

Spacing tokens are available with **spacing** property. Spacings are provided with numerical value and format string.

Example from **tokens object**:

```js
exports.tokens = {
  spacing: {
    l: { value: 32, unit: 'px' }
  }
};
```

JavaScript example:

```js
const spacingL = tokens.spacing.l;
const spacingLWithUnit = spacingL.value + spacingL.unit;
```

TypeScript example with typings:

```ts
import { ValueUnit } from 'suomifi-desing-tokens';

const spacingL: ValueUnit = tokens.spacing.l;
const spacingLWithUnit: string = spacingL.value + spacingL.unit;
```

## ⌨️ Development

See [DEVELOPMENT.md](/DEVELOPMENT.md).

## Licensing

MIT [LICENSE](/LICENSE)
