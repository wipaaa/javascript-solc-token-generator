const Replacer = require('../Replacer');

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

jest.mock('../Replacer');

describe('Replacer utility', () => {
  let replacer = null;

  beforeAll(() => {
    replacer = new Replacer(/__REPLACE_(\w+)__/gi);
  });

  describe('when instantiated', () => {
    it('should be an a truthy', () => {
      expect(replacer).not.toBeFalsy();
      expect(replacer).not.toBeNull();
      expect(replacer).not.toBeUndefined();
    });

    it('should be a valid instance', () => {
      expect(replacer).toBeInstanceOf(Replacer);
    });

    it('should contain a valid property', () => {
      expect(replacer).toHaveProperty('regex', /__REPLACE_(\w+)__/gi);
      expect(replacer).toHaveProperty('rules', {});
    });
  });

  describe('when getRule method called', () => {
    afterEach(() => {
      expect(replacer.getRule).toHaveBeenCalled();
    });

    beforeEach(() => {
      replacer.getRule.mockClear();
    });

    it('should not throw any error', () => {
      expect(() => replacer.getRule([])).not.toThrow();
      expect(replacer.getRule).toHaveBeenCalledWith([]);
    });

    it('should return falsy value when rule not found', () => {
      expect(replacer.getRule([])).toBeFalsy();
      expect(replacer.getRule).toHaveBeenCalledWith([]);
    });

    it('should return actual value when rules is specified', () => {
      replacer.setRules(rules);

      const result = replacer.getRule(['token', 'symbol']);

      expect(result).toBeTruthy();
      expect(result).toMatch('GANAx');
      expect(replacer.getRule).toHaveBeenCalledWith([]);

      replacer.setRules.mockClear();
    });
  });

  describe('when setRules method called', () => {
    afterEach(() => {
      expect(replacer.setRules).toHaveBeenCalled();
      expect(replacer.setRules).toHaveReturned();
    });

    beforeEach(() => {
      replacer.setRules.mockClear();
    });

    it('should not throw any error', () => {
      expect(() => replacer.setRules({})).not.toThrow();
      expect(replacer.setRules).toHaveBeenCalledWith({});
    });

    it('should return replacer object while success', () => {
      const result = replacer.setRules({});

      expect(result).toBeInstanceOf(Replacer);
      expect(replacer.setRules).toHaveBeenCalledWith({});
      expect(replacer.setRules).toHaveReturnedWith(replacer);
    });

    it('should change the rules property', () => {
      replacer.setRules(rules);

      expect(replacer.rules).toBeTruthy();
      expect(replacer.rules).toEqual(rules);
    });
  });
});
