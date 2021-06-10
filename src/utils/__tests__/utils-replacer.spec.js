import { readFileSync } from 'fs';
import { resolve } from 'path';
import Replacer from '../Replacer';

const regex = /__REPLACE_(\w+)__/gi;
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

describe('Resolver utility testing', () => {
  let replacer = null;

  beforeAll(() => {
    replacer = new Replacer(regex);

    jest.spyOn(replacer, 'getRule');
    jest.spyOn(replacer, 'replace');
    jest.spyOn(replacer, 'setRules');
  });

  describe('when instantiated', () => {
    it('should be an instance of replacer class', () => {
      expect(replacer).toBeTruthy();
      expect(replacer).toBeInstanceOf(Replacer);
    });

    it('should have property regex', () => {
      expect(replacer).toHaveProperty('regex', regex);
    });

    it('should have property rules', () => {
      expect(replacer).toHaveProperty('rules', {});
    });
  });

  describe('when getRule method is called', () => {
    beforeEach(() => {
      replacer.getRule.mockClear();
    });

    it('should not throw any error', () => {
      expect(() => replacer.getRule('fake.rule')).not.toThrow();
      expect(replacer.getRule).toHaveBeenCalled();
    });

    it("should return null when no rule's match", () => {
      const result = replacer.getRule('fake.rule');

      expect(replacer.getRule).toHaveBeenCalled();
      expect(replacer.getRule).toHaveBeenCalledWith('fake.rule');
      expect(replacer.getRule).toHaveReturned();
      expect(result).toBeNull();
    });

    it("should return the rule when rule's match", () => {
      replacer.setRules(rules);
      const result = replacer.getRule('token.symbol');

      expect(replacer.getRule).toHaveBeenCalled();
      expect(replacer.getRule).toHaveBeenCalledWith('token.symbol');
      expect(replacer.getRule).toHaveReturned();
      expect(result).toMatch(rules.token.symbol);

      replacer.setRules.mockClear();
    });
  });

  describe('when replace method is called', () => {
    beforeEach(() => {
      replacer.getRule.mockClear();
      replacer.replace.mockClear();
      replacer.setRules.mockClear();
    });

    it('should not to throw any error', () => {
      expect(() => replacer.replace('')).not.toThrow();
      expect(replacer.replace).toHaveBeenCalled();
    });

    it('should match the snapshot of return value provided', () => {
      const path = resolve('src', '../stub/Token.txt');
      const source = readFileSync(path, 'utf-8');
      const result = replacer.replace(source);

      expect(replacer.replace).toHaveBeenCalled();
      expect(replacer.replace).toHaveReturned();
      expect(result).toMatchSnapshot();
    });
  });

  describe('when setRules method is called', () => {
    beforeEach(() => {
      replacer.setRules.mockClear();
    });

    it('should not throw any error', () => {
      expect(() => replacer.setRules(rules)).not.toThrow();
      expect(replacer.setRules).toHaveBeenCalled();
    });

    it('should return the replacer object itself', () => {
      const instance = replacer.setRules(rules);

      expect(replacer.setRules).toHaveBeenCalled();
      expect(replacer.setRules).toHaveReturned();
      expect(instance).toBeInstanceOf(Replacer);
    });

    it('should change the replacer rules property', () => {
      replacer.setRules(rules);

      expect(replacer.setRules).toHaveBeenCalled();
      expect(replacer.setRules).toHaveBeenCalledWith(rules);
      expect(replacer.setRules).toHaveReturned();
      expect(replacer.rules).not.toEqual({});
      expect(replacer.rules).toEqual(rules);
    });
  });
});
