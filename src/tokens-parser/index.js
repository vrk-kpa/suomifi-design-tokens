module.exports = function getTokensByCategory(tokensData, tokens) {
  return Object.entries(tokensData.categories).map(([key, category]) => {
    return {
      category: key,
      prefix: category.tokenPrefix,
      tokens: getCategoryTokens(key, category.tokenPrefix, tokens),
    };
  });
};

function getCategoryTokens(name, prefix, tokens) {
  return Object.entries(tokens).reduce((resultArray, [key, token]) => {
    if (token.category === name) {
      resultArray.push({
        ...token,
        name: key,
        prefix: `${prefix}`,
      });
    }
    return resultArray;
  }, []);
}
