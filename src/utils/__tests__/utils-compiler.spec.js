import Compiler from '../Compiler';
import Replacer from '../Replacer';
import Resolver from '../Resolver';

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

jest.mock('../Compiler');
jest.mock('../Replacer');
jest.mock('../Resolver');

describe('Compiler utility', () => {
  let compiler = null;
  let resolver = new Resolver();

  beforeAll(() => {
    compiler = new Compiler();
  });

  describe('when instantiated', () => {
    it('should be an a truthy', () => {
      expect(compiler).not.toBeFalsy();
      expect(compiler).not.toBeNull();
      expect(compiler).not.toBeUndefined();
    });

    it('should be a valid instance', () => {
      expect(compiler).toBeInstanceOf(Compiler);
    });

    it('should contain a valid property', () => {
      expect(compiler).toHaveProperty('compiler', null);
      expect(compiler).toHaveProperty('input', {});
      expect(compiler).toHaveProperty('regex', /__REPLACE_(\w+)__/gi);
      expect(compiler).toHaveProperty('replacer', null);
      expect(compiler).toHaveProperty('result', {});
      expect(compiler).toHaveProperty('sources', []);
    });
  });

  describe('when compile method called', () => {
    beforeEach(() => {
      compiler.compile.mockClear();
    });

    it('should throw error while object type provided', () => {
      const errorMessage = 'Compiling is only support array sources.';
      expect(() => compiler.compile({})).toThrow(errorMessage);
    });

    it('should return empty object while empty array is provided', () => {
      const result = compiler.compile([]);

      expect(compiler.compile).toHaveBeenCalled();
      expect(compiler.compile).toHaveBeenCalledWith([]);
      expect(result).toEqual({});
    });

    it('should return a valid object', () => {
      const sources = resolver.setFrom('../stub').resolve();
      const result = compiler.compile(sources);

      expect(resolver.setFrom).toHaveBeenCalled();
      expect(resolver.setFrom).toHaveReturned();
      expect(resolver.resolve).toHaveBeenCalled();
      expect(resolver.resolve).toHaveReturned();

      expect(compiler.compile).toHaveBeenCalled();
      expect(compiler.compile).toHaveBeenCalledWith(sources);
      expect(result).toMatchSnapshot();
    });
  });

  describe('when setReplacer method called', () => {
    beforeEach(() => {
      compiler.setReplacer.mockClear();
    });

    it('should throw error while invalid replacer provided', () => {
      const fakeReplacer = class FakeReplacer {};
      const message = 'Your replacer must be follow the Replacer instance.';

      expect(() => compiler.setReplacer(fakeReplacer)).toThrow();
      expect(() => compiler.setReplacer(fakeReplacer)).toThrow(message);
      expect(compiler.setReplacer).toHaveBeenCalledWith(fakeReplacer);
    });

    it('should return compiler object while success', () => {
      const replacer = new Replacer(compiler.regex);
      const result = compiler.setReplacer(replacer);

      expect(compiler.setReplacer).toHaveBeenCalled();
      expect(compiler.replacer).toBeInstanceOf(Replacer);
      expect(result).toBeInstanceOf(Compiler);
    });
  });

  describe('when setRules method is called', () => {
    afterEach(() => {
      expect(compiler.setRules).toHaveBeenCalled();
      expect(compiler.setRules).toHaveReturned();
    });

    beforeEach(() => {
      compiler.replacer.setRules.mockClear();
      compiler.setRules.mockClear();
    });

    it('should not throw error', () => {
      expect(() => compiler.setRules()).not.toThrow();
      expect(compiler.setRules).toHaveBeenCalled();
    });

    it('should change the replacer rules', () => {
      compiler.setRules(rules);

      expect(compiler.replacer.setRules).toHaveBeenCalled();
      expect(compiler.replacer.setRules).toHaveBeenCalledWith(rules);
      expect(compiler.replacer.rules).toEqual(rules);

      compiler.replacer.setRules.mockClear();
    });

    it('should return compiler object while success', () => {
      const result = compiler.setRules(rules);
      expect(result).toBeInstanceOf(Compiler);
    });
  });

  describe('when setSources method is called', () => {
    afterEach(() => {
      expect(compiler.setSources).toHaveBeenCalled();
    });

    beforeEach(() => {
      compiler.setSources.mockClear();
    });

    it('should not throw error', () => {
      const errorMessage = 'Compiling is only support array sources.';

      expect(() => compiler.setSources({})).toThrow();
      expect(() => compiler.setSources({})).toThrow(errorMessage);
      expect(compiler.setSources).toHaveBeenCalledWith({});
    });

    it('should return compiler object when empty array passed', () => {
      const result = compiler.setSources([]);

      expect(compiler.setSources).toHaveBeenCalledWith([]);
      expect(compiler.sources).toEqual([]);
      expect(result).toBeInstanceOf(Compiler);
    });

    it('should change the sources property when provided with valid sources', () => {
      const sources = resolver.setFrom('../stub').resolve();
      const result = compiler.setSources(sources);

      expect(resolver.resolve).toHaveBeenCalled();
      expect(resolver.setFrom).toHaveBeenCalled();
      expect(compiler.setSources).toHaveReturned();
      expect(compiler.sources).toMatchSnapshot();
      expect(result).toBeInstanceOf(Compiler);

      resolver.setFrom.mockClear();
    });
  });
});
