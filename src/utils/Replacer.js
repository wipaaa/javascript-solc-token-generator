module.exports = class Replacer {
  constructor(regex) {
    this.rules = {};
    this.regex = regex;
  }

  replace = (source) => {
    const result = source.replace(this.regex, (match) => {
      const tokenizer = this.#_getTokenizerProperties(match);
      return this.#_getTokenizerReplacement(tokenizer);
    });

    return result;
  };

  setRules = (rules) => {
    this.#_mergeReplacementRules(rules);
    return this;
  };

  #_getTokenizerProperties = (match) => {
    const result = match
      .replace(/__REPLACE_|__/g, '')
      .toLowerCase()
      .split('_');

    return result;
  };

  #_getTokenizerReplacement = (properties = [], rules = this.rules) => {
    const MIN_PROPERTIES_LENGTH_ALLOWED = 1;

    if (properties.length > MIN_PROPERTIES_LENGTH_ALLOWED) {
      const result = rules[properties.shift()];
      return this.#_getTokenizerReplacement(properties, result);
    }

    const result = rules[properties.shift()];
    return result;
  };

  #_mergeReplacementRules = (newRules) => {
    this.rules = {
      ...this.rules,
      ...newRules,
    };
  };
};
