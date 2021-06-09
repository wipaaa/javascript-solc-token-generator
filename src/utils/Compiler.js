module.exports = class Compiler {
  constructor() {
    this.input = {
      language: 'Solidity',
      sources: [],
      settings: { outputSelection: { ['*']: { ['*']: ['*'] } } },
    };
    this.regex = /__REPLACE_(\w+)__/gi;
    this.replacements = {};
    this.sources = [];
  }
};
