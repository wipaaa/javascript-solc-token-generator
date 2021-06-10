const solc = require('solc');
const CompilerError = require('../exceptions/CompilerError');
const Replacer = require('./Replacer');
const ReplacerError = require('../exceptions/ReplacerError');

module.exports = class Compiler {
  constructor() {
    this.compiler = solc;
    this.input = {
      language: 'Solidity',
      sources: {},
      settings: { outputSelection: { ['*']: { ['*']: ['*'] } } },
    };
    this.regex = /__REPLACE_(\w+)__/gi;
    this.replacer = new Replacer(this.regex);
    this.result = {};
    this.sources = [];
  }

  compile = (source = null) => {
    if (source && !Array.isArray(source)) {
      const message = 'Compiling is only support array sources.';
      throw new CompilerError(message);
    }

    if (!source) {
      // while source isn't provided then we'll assume
      // that u want to compile the source from the
      // sources object by calling the 'setSources'
      this.#_compileFromSources();
    }

    if (source && Array.isArray(source)) {
      // while source is provided and the source type is an
      // array we'll assume that u want to compile the
      // source with '_compileFromSources' method
      this.setSources(source).#_compileFromSources();
    }

    this.#_resolveInput();
    this.#_compile();

    return this.#_pullResult();
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

  #_compile = () => {
    if (!this.compiler) {
      const message = 'Please provide any compiler to compile the sources.';
      throw new CompilerError(message);
    }

    const input = JSON.stringify(this.input);
    const compiled = JSON.parse(this.compiler.compile(input));
    const symbol = this.replacer.getRule('token.symbol');

    for (const contract in compiled.contracts) {
      const id = contract.replace('.sol', '');
      let selected = null;

      if (id === 'Token') selected = compiled.contracts[contract][symbol];
      else selected = compiled.contracts[contract][id];

      this.result[id] = {
        abi: selected.abi,
        bytecode: selected.evm.bytecode.object,
        metadata: JSON.parse(selected.metadata),
      };
    }
  };

  #_compileFromSources = () => {
    if (!this.sources.length) {
      return null;
    }

    this.sources.forEach((source, id) => {
      this.sources[id] = {
        ...source,
        content: this.#_compileSourceContent(source.content),
      };
    });

    return null;
  };

  #_compileSourceContent = (source) => {
    const compiled = this.replacer.replace(source);
    return compiled;
  };

  #_pullResult = () => {
    const { result } = this;
    this.result = {};

    return result;
  };

  #_pullSources = () => {
    const { sources } = this;
    this.sources = [];

    return sources;
  };

  #_resolveInput = () => {
    const sources = this.#_pullSources();

    if (!sources.length) {
      return null;
    }

    sources.forEach((source) => {
      const { content, name } = source;
      this.input.sources[name] = { content };
    });

    return null;
  };
};
