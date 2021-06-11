import Resolver from '../Resolver';

describe('Resolver utility test', () => {
  let resolver = null;

  beforeAll(() => {
    resolver = new Resolver();
  });

  describe('when instantiated', () => {
    it('should be an instance of resolver class', () => {
      expect(resolver).toBeTruthy();
      expect(resolver).toBeInstanceOf(Resolver);
    });

    it('should have property sources', () => {
      expect(resolver).toHaveProperty('sources', []);
    });

    it('should have property defaults and match defaults property snapshot', () => {
      expect(resolver).toHaveProperty('defaults');
      expect(resolver.defaults).toMatchSnapshot();
    });
  });

  describe('when resolve method called', () => {
    beforeEach(() => {
      resolver.sources = [];
    });

    it('should not throw any error', () => {
      expect(() => resolver.resolve()).not.toThrow();
    });

    it('should return empty array when no sources provided', () => {
      const sources = resolver.resolve();
      expect(sources).toEqual([]);
    });

    it('should match the sources snapshot', () => {
      const path = '../stub';
      const sources = resolver.setFrom(path).resolve();
      expect(sources).toMatchSnapshot();
    });
  });

  describe('when setFrom method called', () => {
    beforeEach(() => {
      resolver.sources = [];
    });

    it('should throw an error while provided with invalid path', () => {
      expect(() => resolver.setFrom('/fake/path')).toThrow();
    });

    it('should return the resolver object itself', () => {
      const instance = resolver.setFrom('../stub');

      expect(instance).toBeTruthy();
      expect(instance).toBeInstanceOf(Resolver);
    });

    it('should change the sources property', () => {
      resolver.setFrom('../stub');
      expect(resolver.sources).not.toEqual([]);
    });

    it('should match the sources snapshot', () => {
      resolver.setFrom('../stub');
      expect(resolver.sources).toMatchSnapshot();
    });
  });
});
