const Compiler = require('../Compiler');
const Replacer = require('../Replacer');

jest.mock('../Compiler');
jest.mock('../Replacer');

describe('Compiler utility', () => {
  let compiler = null;

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
      const source = {
        name: 'example',
        abi: [],
        bytecode: 'bytecode',
        metadata: {},
      };

      const result = compiler.compile([source]);

      expect(compiler.compile).toHaveBeenCalled();
      expect(compiler.compile).toHaveBeenCalledWith([source]);
      expect(result[source.name]).toEqual({
        abi: source.abi,
        bytecode: source.bytecode,
        metadata: source.metadata,
      });
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
      const result = compiler.setReplacer(new Replacer());

      expect(compiler.setReplacer).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Compiler);
    });
  });

  describe('when setRules method is called', () => {
    beforeEach(() => {
      compiler.setRules.mockClear();
    });

    it('should not throw error', () => {
      expect(() => compiler.setRules()).not.toThrow();
      expect(compiler.setRules).toHaveBeenCalled();
    });

    it('should return compiler object while success', () => {
      const result = compiler.setReplacer(new Replacer());

      expect(compiler.setReplacer).toHaveBeenCalled();
      expect(result).toBeInstanceOf(Compiler);
    });
  });

  describe('when setSources method is called', () => {
    beforeEach(() => {
      compiler.setSources.mockClear();
    });

    it('should not throw error', () => {
      const errorMessage = 'Compiling is only support array sources.';

      expect(() => compiler.setSources({})).toThrow();
      expect(() => compiler.setSources({})).toThrow(errorMessage);
      expect(compiler.setSources).toHaveBeenCalled();
      expect(compiler.setSources).toHaveBeenCalledTimes(2);
      expect(compiler.setSources).toHaveBeenCalledWith({});
    });

    it('should return compiler object when empty array passed', () => {
      const result = compiler.setSources([]);

      expect(compiler.setSources).toHaveBeenCalled();
      expect(compiler.setSources).toHaveBeenCalledWith([]);
      expect(compiler.sources).toEqual([]);
      expect(result).toBeInstanceOf(Compiler);
    });

    it('should change the sources property when provided with valid sources', () => {
      const result = compiler.setSources([{}]);

      expect(compiler.setSources).toHaveBeenCalled();
      expect(compiler.setSources).toHaveBeenCalledWith([{}]);
      expect(compiler.sources).toEqual([{}]);
      expect(result).toBeInstanceOf(Compiler);
    });
  });
});
