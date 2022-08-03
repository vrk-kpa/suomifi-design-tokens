# Suomifi Design System Tokens

## ℹ Token Data

The design system tokens are stored in the tokens.json and derived-tokens.json files. The files consist of token categories and tokens.

### 📖 Categories

Basic tokens (in the tokens.json file) are atomic values, for example color values. The derived tokens (derived-tokens.json) on the other hand are design elements which are derived from the basic atomic tokens, for example color gradients.

The tokens are further divided into categories based on token type. Categories include a token prefix for the tokens in the category and description information. All tokens belong to exactly one category.

Current basic token categories are:

- Colors
- Typography
- Spacing
- Radiuses
- Transitions

And the derived token categories are:

- Gradients
- Shadows
- Focuses

### 📃 Tokens

All tokens have a category, version, value, type and comments.

Currently token values are defined by type in the following way:

- **hsl**: object with keys for **h**, **s** and **l** and corresponding _integer_ values
- **font**: object with keys for font_Family, genericFontFamily, fontSize, lineHeight and fontWeight
  - **fontFamily**: _array of strings_
  - **genericFontFamily**: _string_
  - **fontSize** and **lineHeight**: _object_ with keys for value and unit where **value** is an _integer_ or _string_ and **unit** either a _string_ or _null_
  - **fontWeight**: _integer_
- **size**: _object_ with keys for value and unit where **value** is an _integer_ and **unit** is either a _string_ or _null_.
- **string**: _object_ with a key called value which has any _string_ value

- **derived-string**: _object_ with a key called value which has a _string_ value. The value might contain variables, which correspond to basic tokens. In terms of syntax, the variables are marked inside curly braces {} and contain two parts separated by a period: category and token name. In addition, the variable might have a modifier which is separated by a comma.

Example of derived-string type:

```json
"whiteBaseNegative": {
  "category": "gradients",
  "version": "1.0",
  "value": {
    "value": "linear-gradient(-180deg, {colors.whiteBase, alpha-0.1} 0%, {colors.whiteBase, alpha-0} 100%)"
  },
  "type": "derived-string",
  "comments": []
},
```

- **derived-object**: Similar as above but with more than one value

Example:

```json
"boxShadowFocus": {
  "category": "focuses",
  "version": "1.0",
  "value": {
    "outline": "0",
    "borderRadius": "{radiuses.focus}",
    "boxShadow": "0 0 0 2px {colors.accentSecondary}"
  },
  "type": "derived-object",
  "comments": []
},
```

## ⌨️ Development

### 🏗 Setting up local development environment

You'll need [Node.js](https://nodejs.org), [NPM](https://www.npmjs.com/get-npm) and [YARN](https://yarnpkg.com/) installed and configured on your machine. Setting these up is beoynd the scope of these instructions.

Clone the repository [suomifi-design-tokens](https://github.com/vrk-kpa/suomifi-design-tokens) to your local machine and run

```bash
yarn
```

### 🛠Adding and modifying tokens and categories

1. Create a new branch for your changes, nothing will be merged directly to master.
2. Modify the **tokens.json** or **derived-tokens.json** file following the format described above. Note that if you are making changes to derived tokens and are implementing variable types which are new, make sure the converter logic supports them. You probably need to write new code.
3. Run

```bash
yarn build
```

and see that the build passes without failures

4. Verify that a **dist** directory is created and contains the following files:
   - index.d.ts
   - index.js
   - tokens.scss
5. Verify that the contents of the files is as expected (valid scss, js and ts)
6. Create a pull request for your branch and get the needed reviews.
7. Merge the pull request to master.

### 🌍 Publishing the changes

1. Create a new branch for version change
2. Change the version in **package.json** according to sematic versioning principles [semver.org](https://semver.org/)
3. Run

```bash
yarn build
```

and verify that everything still works as expected

4. Publish the packge to npm
5. Test the package by installing it to a project and using it
6. Create a pull request for your branch and get the needed reviews.
7. Merge the pull request to master.
