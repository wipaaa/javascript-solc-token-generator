const Compiler = require('./Compiler');
const Replacer = require('./Replacer');
const Resolver = require('./Resolver');

module.exports = {
  compiler: new Compiler(),
  replacer: new Replacer(),
  resolver: new Resolver(),
};
