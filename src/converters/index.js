module.exports.ts = {
  converters: [require('./typescript')],
  name: 'TypeScript',
  outFileName: 'index',
};

module.exports.scss = {
  converters: [require('./scss')],
  name: 'SCSS',
  outFileName: 'tokens',
};
