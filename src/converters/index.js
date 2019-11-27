module.exports.ts = {
  converters: [require('./typescript-raw'), require('./typescript-css-in-js')],
  name: 'TypeScript',
  outFileName: 'index',
};

module.exports.scss = {
  converters: [require('./scss')],
  name: 'SCSS',
  outFileName: 'tokens',
};
