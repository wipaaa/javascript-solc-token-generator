const Compiler = require('./Compiler');
const Resolver = require('./Resolver');

module.exports = {
  compiler: new Compiler(),
  resolver: new Resolver(),
};
