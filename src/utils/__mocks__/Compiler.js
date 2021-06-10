const Replacer = require('../Replacer');

jest.mock('../Replacer');

module.exports = class Compiler {
  constructor() {
    this.compiler = null;
    this.input = {};
    this.regex = /__REPLACE_(\w+)__/gi;
    this.replacer = null;
    this.result = {};
    this.sources = [];
  }

  compile = jest.fn().mockImplementation((sources) => {
    if (sources && !Array.isArray(sources)) {
      const message = 'Compiling is only support array sources.';
      throw new Error(message);
    }

    const result = {};

    (sources ?? this.sources).forEach((source) => {
      const {
        abi = null,
        bytecode = null,
        metadata = null,
        name = null,
      } = source;

      result[name] = {
        abi,
        bytecode,
        metadata,
      };
    });

    return result;
  });

  setReplacer = jest.fn().mockImplementation((replacer) => {
    if (replacer instanceof Replacer) {
      this.replacer = replacer;
      return this;
    }

    const message = 'Your replacer must be follow the Replacer instance.';
    throw new Error(message);
  });

  setRules = jest.fn().mockImplementation((rules) => {
    this.replacer.setRules(rules);
    return this;
  });

  setSources = jest.fn().mockImplementation((sources) => {
    if (sources && !Array.isArray(sources)) {
      const message = 'Compiling is only support array sources.';
      throw new Error(message);
    }

    if (!sources || (sources && !sources.length)) {
      return this;
    }

    this.sources = sources;
    return this;
  });
};
