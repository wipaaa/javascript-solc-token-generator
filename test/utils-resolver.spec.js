const Resolver = require('../src/utils/Resolver');

const resolver = new Resolver();
const directory = '../stub';

describe('Resolver utility', () => {
  describe('when instantiated', () => {
    it('should be a Replacer instance', () => {
      expect(resolver).not.toBeFalsy();
      expect(resolver).not.toBeUndefined();
      expect(resolver).toBeInstanceOf(Resolver);
    });
  });

  describe('when sources specified', () => {
    it('should match the stub files snapshot', () => {
      resolver.setFrom(directory);

      expect(resolver.sources).not.toBeFalsy();
      expect(resolver.sources).not.toBeUndefined();
      expect(resolver.sources).toMatchSnapshot();
    });
  });

  describe('when sources resolved', () => {
    it('should match the result snapshot', () => {
      const resolved = resolver.setFrom(directory).resolve();

      expect(resolved).not.toBeFalsy();
      expect(resolved).not.toBeUndefined();
      expect(resolved).toMatchSnapshot();
    });
  });
});
