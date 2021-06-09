const Compiler = require('./Compiler');
const Provider = require('./Provider');
const Replacer = require('./Replacer');
const Resolver = require('./Resolver');

module.exports = {
  compiler: new Compiler(),
  provider: new Provider(),
  replacer: new Replacer(),
  resolver: new Resolver(),
};
