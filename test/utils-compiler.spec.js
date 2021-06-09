const Compiler = require('../src/utils/Compiler');
const Replacer = require('../src/utils/Replacer');
const Resolver = require('../src/utils/Resolver');

const compiler = new Compiler();
const resolver = new Resolver();
const rules = {
  token: {
    name: 'GANA Token',
    symbol: 'GANAx',
    decimals: 18,
    supply: {
      max: 0,
      total: 10,
    },
  },
};

describe('Compiler utility', () => {
  describe('when instantiated', () => {
    it('should be a Replacer instance', () => {
      expect(compiler).not.toBeFalsy();
      expect(compiler).not.toBeUndefined();
      expect(compiler).toBeInstanceOf(Compiler);
    });
  });

  describe('when replacer property specified', () => {
    it('should be an instance of Replacer class', () => {
      compiler.setRules(rules);

      expect(compiler.replacer).not.toBeFalsy();
      expect(compiler.replacer).not.toBeUndefined();
      expect(compiler.replacer).toBeInstanceOf(Replacer);
    });
  });

  describe('when resolving stub data', () => {
    it('should update the sources', () => {
      const result = compiler.setSources(resolver.setFrom('../stub').resolve());

      expect(result.sources).not.toBeFalsy();
      expect(result.sources).not.toBeUndefined();
      expect(result.sources).toMatchSnapshot();
    });
  });

  describe('when compiling stub data', () => {
    it('should be an truthy data', () => {
      const result = compiler
        .setSources(resolver.setFrom('../stub').resolve())
        .compile();

      expect(result).not.toBeFalsy();
      expect(result).not.toBeUndefined();
    });
  });
});
