const fs = require('fs');
const tokensInterfaceName = 'DesignTokens'; // interface name matching the template
const rawTokensInterfaceName = 'RawDesignTokens'; // interface name for object format tokens matching the template
const exportObjectName = 'suomifiDesignTokenObjects';
require.extensions['.template'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};
const staticInterfaces = require('./interfaces.ts.template');

const formatToTS = require('./string-format');
const formatToTSRaw = require('./raw-format');

function convertTokensToTS(tokensByCategory) {
  return (
    staticInterfaces +
    '\n\n' +
    formatToTSRaw(tokensByCategory, rawTokensInterfaceName, exportObjectName) +
    formatToTS(tokensByCategory, tokensInterfaceName, exportObjectName) +
    '\n\n'
  );
}

module.exports.format = 'ts';
module.exports.convert = convertTokensToTS;
