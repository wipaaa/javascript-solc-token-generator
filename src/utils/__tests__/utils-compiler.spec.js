import { beforeEach, expect } from '@jest/globals';
import solc from 'solc';
import Compiler from '../Compiler';
import Replacer from '../Replacer';

jest.mock('solc');
jest.mock('../Replacer');

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

const sources = [
  {
    name: 'Name.sol',
    content: '__REPLACE_TOKEN_NAME__',
    path: '/path/to/Name.txt',
  },
  {
    name: 'Symbol.sol',
    content: '__REPLACE_TOKEN_SYMBOL__',
    path: '/path/to/Symbol.txt',
  },
  {
    name: 'Decimals.sol',
    content: '__REPLACE_TOKEN_DECIMALS__',
    path: '/path/to/Decimals.txt',
  },
  {
    name: 'SupplyTotal.sol',
    content: '__REPLACE_TOKEN_SUPPLY_TOTAL__',
    path: '/path/to/SupplyTotal.txt',
  },
  {
    name: 'SupplyMax.sol',
    content: '__REPLACE_TOKEN_SUPPLY_MAX__',
    path: '/path/to/SupplyMax.txt',
  },
];

const contracts = {};

sources.forEach((source) => {
  const name = source.name;
  const id = source.name.replace('.sol', '');

  contracts[name] = {};
  contracts[name][id] = {};
  contracts[name][id].abi = [];
  contracts[name][id].evm = { bytecode: { object: '' } };
  contracts[name][id].metadata = JSON.stringify({});
});

describe('Compiler utility test', () => {
  let compiler = null;
  let replacer = null;

  beforeAll(() => {
    compiler = new Compiler();
    replacer = new Replacer(compiler.regex);
  });

  describe('when instantiated', () => {
    it('should be an instance of compiler class', () => {
      expect(compiler).toBeTruthy();
      expect(compiler).toBeInstanceOf(Compiler);
    });

    it('should have property compiler', () => {
      expect(compiler).toHaveProperty('compiler');
    });

    it('should have property input', () => {
      expect(compiler).toHaveProperty('input');
    });

    it('should have property regex', () => {
      expect(compiler).toHaveProperty('regex');
    });

    it('should have property replacer', () => {
      expect(compiler).toHaveProperty('replacer');
    });

    it('should have property result', () => {
      expect(compiler).toHaveProperty('result', {});
    });

    it('should have property sources', () => {
      expect(compiler).toHaveProperty('sources', []);
    });
  });

  describe('when compile method called', () => {
    beforeEach(() => {
      replacer.getRule
        .mockName('Replacer.getRule()')
        .mockReturnValue('Example');

      replacer.replace
        .mockName('Replacer.replace()')
        .mockReturnValue('Example replaced source');

      replacer.setRules
        .mockName('Replacer.setRules()')
        .mockImplementation((rules) => (replacer.rules = rules))
        .mockReturnThis();

      solc.compile
        .mockName('solc.compile()')
        .mockReturnValue(JSON.stringify({ contracts }));
    });

    it("should throw error while provided argument's not an array", () => {
      expect(() => compiler.compile({})).toThrow();
    });

    it('should throw error while no compiler provided', () => {
      const compilerBackup = compiler.compiler;
      compiler.compiler = class FakeCompiler {};

      expect(() => compiler.compile([])).toThrow();
      compiler.compiler = compilerBackup;
    });

    it('should match the compiled sources snapshot', () => {
      const result = compiler
        .setReplacer(replacer)
        .setRules(rules)
        .setSources(sources)
        .compile();

      // test replacer method must be called
      expect(replacer.getRule).toHaveBeenCalled();
      expect(replacer.getRule).toHaveReturnedWith('Example');
      expect(replacer.replace).toHaveBeenCalled();
      expect(replacer.replace).toHaveReturnedWith('Example replaced source');

      // test solc compile method must be called
      expect(solc.compile).toHaveBeenCalled();
      expect(solc.compile).toHaveReturned();
      expect(solc.compile).toHaveReturnedWith(JSON.stringify({ contracts }));

      // test returned result
      expect(result).toBeTruthy();
      expect(result).toMatchSnapshot();
    });
  });

  describe('when setReplacer method called', () => {
    it('should throw error when invalid replacer is provided', () => {
      class FakeReplacer {}
      expect(() => setReplacer(new FakeReplacer())).toThrow();
    });

    it('should return the compiler object itself', () => {
      const instance = compiler.setReplacer(replacer);

      expect(instance).toBeTruthy();
      expect(instance).toBeInstanceOf(Compiler);
    });

    it('should change the compiler replacer property', () => {
      compiler.setReplacer(replacer);

      expect(compiler.replacer).toBeTruthy();
      expect(compiler.replacer).toBeInstanceOf(Replacer);
    });
  });

  describe('when setRules method called', () => {
    beforeEach(() => {
      replacer.rules = {};
      replacer.setRules = jest
        .fn()
        .mockName('replacer.setRules()')
        .mockImplementation((rules) => {
          replacer.rules = rules;
        });
    });

    it('should not throw any error', () => {
      expect(() => compiler.setRules(rules)).not.toThrow();
    });

    it('should return the compiler object itself', () => {
      const instance = compiler.setRules(rules);

      expect(instance).toBeTruthy();
      expect(instance).toBeInstanceOf(Compiler);
    });

    it('should change the compiler rules property', () => {
      compiler.setRules(rules);

      expect(replacer.setRules).toHaveBeenCalled();
      expect(replacer.setRules).toHaveBeenCalledWith(rules);
      expect(replacer.setRules).toHaveReturned();
      expect(replacer.rules).toBeTruthy();
      expect(replacer.rules).toEqual(rules);
    });
  });

  describe('when setSources method called', () => {
    beforeEach(() => {
      compiler.sources = [];
    });

    it("should not throw error while provided arguments is'nt an array", () => {
      expect(() => compiler.setSources({})).toThrow();
    });

    it('should return compiler object itself', () => {
      const instance = compiler.setSources(sources);

      expect(instance).toBeTruthy();
      expect(instance).toBeInstanceOf(Compiler);
    });

    it('should change the sources property', () => {
      compiler.setSources(sources);

      expect(compiler.sources).toBeTruthy();
      expect(compiler.sources).not.toEqual({});
      expect(compiler.sources).not.toEqual([]);
      expect(compiler.sources).toEqual(sources);
    });
  });
});
