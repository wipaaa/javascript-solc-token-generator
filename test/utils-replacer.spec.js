const Replacer = require('../src/utils/Replacer');

const replacer = new Replacer(/__REPLACE_(\w+)__/gi);
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

describe('Replacer utility', () => {
  describe('when instantiated', () => {
    it('should be a Replacer instance', () => {
      expect(replacer).not.toBeFalsy();
      expect(replacer).not.toBeUndefined();
      expect(replacer).toBeInstanceOf(Replacer);
    });
  });

  describe('when rules added', () => {
    it('should return self instance', () => {
      const result = replacer.setRules({});

      expect(result).not.toBeFalsy();
      expect(result).not.toBeUndefined();
      expect(result).toBeInstanceOf(Replacer);
    });

    it('should change the rules property', () => {
      replacer.setRules(rules);

      expect(replacer.rules).not.toBeFalsy();
      expect(replacer.rules).not.toBeUndefined();
      expect(replacer.rules).toEqual(rules);
    });
  });

  describe('when rules fetched', () => {
    it('should match the replacement', () => {
      const {
        name,
        symbol,
        decimals,
        supply: { max, total },
      } = rules.token;

      replacer.setRules(rules);

      expect(replacer.getRule('token.name')).toMatch(name);
      expect(replacer.getRule('token.symbol')).toMatch(symbol);
      expect(replacer.getRule('token.decimals')).toBe(decimals);
      expect(replacer.getRule('token.supply.max')).toBe(max);
      expect(replacer.getRule('token.supply.total')).toBe(total);
    });
  });
});
