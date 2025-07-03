# Suomifi Design System Tokens

The Design System Tokens repository contains color, typography and spacing definitions as tokens following the Suomi.fi-brand. The repository uses semantic versioning (https://semver.org/).

## ✨ Features

The design system tokens are available in SCSS and JavaScript formats. Typings for TypeScript are also available.

The following token types are currently available:

- Colors
- Typography
- Spacing
- Gradients
- Shadows
- Focus
- Radius
- Transitions
- Breakpoints

# 📦 Install

```bash
npm install suomifi-design-tokens
```

# 🔨 Usage

## SCSS

Tokens are available as named SCSS variables and mixins with **\$fi-** prefix. Tokens can be imported to scss files:

```scss
@import '~suomifi-design-tokens/dist/tokens';
```

### 🎨 Colors

Color tokens are available as variables with additional **color-** prefix. Colors are provided as hsl values.

Excerpt from **tokens.scss**:

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

Typography tokens are available as mixins with additional **text-** prefix.

Excerpt from **tokens.scss**:

```scss
@mixin fi-text-heading1 {
  font-family: 'Source Sans Pro', 'Helvetica Neue', 'Arial',
    sans-serif;
  font-size: 40px;
  line-height: 48px;
  font-weight: 300;
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

Excerpt from **tokens.scss**:

```scss
$fi-spacing-l: 32px;
```

Example use case:

```scss
.custom-class {
  margin: $fi-spacing-l;
}
```

### 🎨 Gradients

Gradient tokens are available as variables with additional **gradient-** prefix.

Excerpt from **tokens.scss**:

```scss
$fi-gradient-highlight-base-to-highlight-dark1: linear-gradient(
  0deg,
  hsl(212, 63%, 45%) 0%,
  hsl(212, 63%, 37%) 100%
);
```

Example use case:

```scss
.custom-class {
  background-color: $fi-gradient-highlight-base-to-highlight-dark1;
}
```

### ❏ Shadows

Shadow tokens are available as variables with additional **shadow-** prefix.

Excerpt from **tokens.scss**:

```scss
$fi-shadow-menu-shadow: 0 2px 3px 0 hsla(0, 0%, 16%, 0.2);
```

Example use case:

```scss
.custom-class {
  box-shadow: $fi-shadow-menu-shadow;
}
```

### 𑗏 Focus

Focus tokens are available as mixins with additional **focus-** prefix.

Excerpt from **tokens.scss**:

```scss
@mixin fi-focus-box-shadow-focus {
  border-radius: 2px;
  box-shadow: 0 0 0 2px hsl(196, 77%, 44%);
  outline: 0;
}
```

Example use case:

```scss
.custom-class {
  @include fi-focus-box-shadow-focus;
}
```

### ⌝ Radius

Radius tokens are available as variables with additional **radius-** prefix.

Excerpt from **tokens.scss**:

```scss
$fi-radius-basic: 2px;
```

Example use case:

```scss
.custom-class {
  border-radius: $fi-radius-basic;
}
```

### 💨 Transitions

Transition tokens are available as variables with additional **transition-** prefix.

Excerpt from **tokens.scss**:

```scss
$fi-transition-basic-timing-function: cubic-bezier(
  0.28,
  0.84,
  0.42,
  1
);
```

Example use case:

```scss
.custom-class {
  transition: all 50ms $fi-transition-basic-timing-function;
}
```

## JavaScript and TypeScript

Tokens are available as named **suomifiDesignTokens** export and can be imported to JavaScript and TypeScript files.

**suomifiDesignTokens** exports the design tokens as css formatted strings and in more granular format so that individual properties are available with values and units.

JavaScript example:

```js
import { suomifiDesignTokens } from 'suomifi-design-tokens';
```

TypeScript example with typings:

```ts
import {
  suomifiDesignTokens,
  DesignTokens
} from 'suomifi-design-tokens';

const tokens: DesignTokens = suomifiDesignTokens;
```

### 🎨 Colors

Color tokens are available with **colors** property as css strings. Separated h, s and l values can be accessed through **values** property.

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  colors: {
    whiteBase: 'hsl(0, 0%, 100%)'
  },
  values: {
    colors: {
      whiteBase: { h: 0, s: 0, l: 100 }
    }
  }
};
```

JavaScript example:

```js
const brandBaseLightness =
  suomifiDesignTokens.values.colors.brandBase.l;

const brandBaseCss = suomifiDesignTokens.colors.brandBase;
```

TypeScript example with typings:

```ts
import { ColorToken } from 'suomifi-design-tokens';

const brandBase: ColorToken =
  suomifiDesignTokens.values.colors.brandBase;
const brandBaseLightness: string = brandBase.l;

const brandBaseCSS: string = suomifiDesignTokens.colors.brandBase;
```

### 🖋 Typography

Typography tokens are available with **typography** property as css strings. Separated fontFamily, fontSize, lineHeight and fontWeight properties can be accessed through **values** property.

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  typography: {
    heading1:
      "font-family: 'Source Sans Pro', 'Helvetica Neue', 'Arial', sans-serif; font-size: 40px; line-height: 48px; font-weight: 300;"
  },
  values: {
    typography: {
      heading1: {
        fontFamily:
          "'Source Sans Pro', 'Helvetica Neue', 'Arial', sans-serif",
        fontSize: { value: 40, unit: 'px' },
        lineHeight: { value: 48, unit: 'px' },
        fontWeight: 300
      }
    }
  }
};
```

JavaScript example:

```js
const heading1 = suomifiDesignTokens.values.typography.heading1;
const heading1FontSize =
  heading1.fontSize.value + heading1.fontSize.unit;
const heading1FontFamily = heading1.fontFamily;

const heading1Css = suomifiDesignTokens.typography.heading1;
```

TypeScript example with typings:

```ts
import { TypographyToken } from 'suomifi-design-tokens';

const heading1: TypographyToken =
  suomifiDesignTokens.values.typography.heading1;
const heading1FontSize: string =
  heading1.fontSize.value + heading1.fontSize.unit;
const heading1FontFamily: string = heading1.fontFamily;

const heading1Css: string = suomifiDesignTokens.typography.heading1;
```

### 📏 Spacing

Spacing tokens are available with **spacing** property as CSS strings. Separated unit and value properties can be accessed through **values** property.

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  spacing: {
    l: '32px'
  },
  values: {
    spacing: {
      l: { value: 32, unit: 'px' }
    }
  }
};
```

JavaScript example:

```js
const spacingL = suomifiDesignTokens.values.spacing.l;
const spacingLWithUnit = spacingL.value + spacingL.unit;

const spacingLCss = suomifiDesignTokens.spacing.l;
```

TypeScript example with typings:

```ts
import { ValueUnit } from 'suomifi-design-tokens';

const spacingL: ValueUnit = suomifiDesignTokens.values.spacing.l;
const spacingLWithUnit: string = spacingL.value + spacingL.unit;

const spacingLCss: string = suomifiDesignTokens.spacing.l;
```

### 🎨 Gradients

Gradient tokens are available with **gradients** property as css strings.

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  colors: {
    highlightBaseToHighlightDark1: 'linear-gradient(0deg, hsl(212, 63%, 45%) 0%, hsl(212, 63%, 37%) 100%)';
  },
};
```

### ❏ Shadows

Shadow tokens are available with **shadows** property as css strings.

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  shadows: {
    menuShadow: "0 2px 3px 0 hsla(0, 0%, 16%, 0.2)";
  },
};
```

### 𑗏 Focus

Focus tokens are available with **focuses** property as css strings.

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  focuses: {
    boxShadowFocus:
      'border-radius: 2px;box-shadow: 0 0 0 2px hsl(196, 77%, 44%);outline: 0;'
  }
};
```

### ⌝ Radius

Radius tokens are available with **radiuses** property as css strings.

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  radiuses: {
    basic: '2px'
  }
};
```

### 💨 Transitions

Radius tokens are available with **transitions** property as css strings.

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  transitions: {
    basicTimingFunction: 'cubic-bezier(0.28, 0.84, 0.42, 1)'
  }
};
```

### Breakpoints

Breakpoint tokens are available with **breakpoints** property as css strings. The values are static pixel values, and the usage logic is meant to be as follows:

- xxl: >=1400
- xl: >=1200
- l: >=900
- m: >=768
- s: >=576

Excerpt from **suomifiDesignTokens** object:

```js
exports.suomifiDesignTokens = {
  breakpoints: {
    xxl: '1400px'
  }
};

## ⌨️ Development

See [DEVELOPMENT.md](/DEVELOPMENT.md).

## Licensing

MIT [LICENSE](/LICENSE)
```
