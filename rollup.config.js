export default [
  {
    input: "tmp/index.js",
    output: [
      {
        file: "dist/index.js",
        format: "cjs"
      },
      {
        file: "dist/esm/index.js",
        format: "esm"
      }
    ]
  }
];
