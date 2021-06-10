const _getTokenizerReplacement = (keys, rules = {}) => {
  const MIN_KEYS_LENGTH_ALLOWED = 1;

  if (keys.length > MIN_KEYS_LENGTH_ALLOWED) {
    const result = rules[keys.shift()];
    return _getTokenizerReplacement(keys, result);
  }

  const result = rules[keys.shift()];
  return result;
};

export default jest.fn().mockImplementation(function (regex) {
  this.regex = regex;
  this.rules = {};

  this.getRule = jest.fn().mockImplementation((rule) => {
    const result = _getTokenizerReplacement(rule, this.rules);
    return result;
  });

  this.setRules = jest.fn().mockImplementation((rules) => {
    this.rules = { ...this.rules, ...rules };
    return this;
  });
});
