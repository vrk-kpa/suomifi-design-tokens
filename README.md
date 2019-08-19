# suomifi-design-tokens

Design System tokens

The Design system tokens are represented in tokens.json file.
The file consists of categories and tokens.

Categories include token prefix and description information.
All tokens belong to one category.

All tokens have a category, version, value, type and comments.

Token values are defined by type in the following way:

- **hsl**: object with keys for **h**, **s** and **l** and corresponding _integer_ values
- **font**: object with keys for font_Family, fontSize, lineHeight and fontWeight
  - **fontFamily**: _array of strings_
  - **fontSize** and **lineHeight**: _object_ with keys for value and unit where **value** is an _integer_ and **unit** either a _string_ or _null_
  - **fontWeight**: _integer_
- **size**: _object_ with keys for value and unit where **value** is an _integer_ and **unit** is either a _string_ or _null_.
