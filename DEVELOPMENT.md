# Suomifi Design System Tokens

## ℹ Token Data

The design system tokens are stored in the tokens.json file. The file consists of token categories and tokens.

### 📖 Categories

Design tokens are divided into categories based on token type. Categories include a token prefix for the tokens in the category and description information. All tokens belong to exactly one category.

Current categories are:

- Colors
- Typography
- Spacing

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

## ⌨️ Development

### 🏗 Setting up local development environment

You'll need [Node.js](https://nodejs.org), [NPM](https://www.npmjs.com/get-npm) and [YARN](https://yarnpkg.com/) installed and configured on your machine. Setting these up is beoynd the scope of these instructions.

Clone the repository [suomifi-design-tokens](https://github.com/vrk-kpa/suomifi-design-tokens) to your local machine and run

```bash
yarn
```

### 🛠Adding and modifying tokens and categories

1. Create a new branch for your changes, nothing will be merged directly to master.
2. Modify the **tokens.json** file following the format described above
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
