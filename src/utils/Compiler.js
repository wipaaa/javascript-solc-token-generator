const Replacer = require('./Replacer');
const ReplacerError = require('../exceptions/ReplacerError');

module.exports = class Compiler {
  constructor() {
    this.input = {
      language: 'Solidity',
      sources: [],
      settings: { outputSelection: { ['*']: { ['*']: ['*'] } } },
    };
    this.regex = /__REPLACE_(\w+)__/gi;
    this.replacer = new Replacer(this.regex);
    this.sources = [];
  }

  compile = (source = null) => {
    if (source && Array.isArray(source)) {
      // while source is provided and the source type is an
      // array we'll assume that u want to compile the
      // source with '_compileFromSources' method
      this.setSources(source).#_compileFromSources();
      return null;
    }

    if (!source) {
      // while source isn't provided then we'll assume
      // that u want to compile the source from the
      // sources object by calling the 'setSources'
      this.#_compileFromSources();
      return null;
    }

    return this.#_compileFromSource(source);
  };

  setReplacer = (replacer) => {
    if (replacer instanceof Replacer) {
      this.replacer = replacer;
      return this;
    }

    const message = 'Your replacer must be follow the Replacer instance.';
    throw new ReplacerError(message);
  };

  setRules = (rules) => {
    this.replacer.setRules(rules);
    return this;
  };

  setSources = (sources) => {
    if (!Array.isArray(sources)) {
      const message = `Sources is expected to be array instead of ${typeof sources}`;
      throw new TypeError(message);
    }

    if (!sources.length) {
      // while the given sources is empty than we'll
      // just return this object to continue the
      // flow so the program won't crash
      return this;
    }

    this.sources = sources;
    return this;
  };

  #_compileFromSource = (source) => {
    const compiled = this.replacer.replace(source);
    return compiled;
  };

  #_compileFromSources = () => {
    if (!this.sources.length) {
      return null;
    }

    this.sources.forEach((source, id) => {
      this.sources[id] = {
        ...source,
        content: this.#_compileFromSource(source.content),
      };
    });

    return null;
  };
};
