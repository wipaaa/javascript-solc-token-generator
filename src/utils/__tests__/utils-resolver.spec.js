import Resolver from '../Resolver';

describe('Resolver utility test', () => {
  let resolver = null;

  beforeAll(() => {
    resolver = new Resolver();

    jest.spyOn(resolver, 'resolve');
    jest.spyOn(resolver, 'setFrom');
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
      resolver.resolve.mockClear();
    });

    it('should not throw any error', () => {
      expect(() => resolver.resolve()).not.toThrow();
      expect(resolver.resolve).toHaveBeenCalled();
    });

    it('should return empty array when no sources provided', () => {
      const sources = resolver.resolve();

      expect(resolver.resolve).toHaveBeenCalled();
      expect(resolver.resolve).toHaveReturned();
      expect(sources).toEqual([]);
    });

    it('should match the sources snapshot', () => {
      resolver.sources = [];

      const path = '../stub';
      const sources = resolver.setFrom(path).resolve();

      expect(resolver.setFrom).toHaveBeenCalledWith(path);
      expect(resolver.setFrom).toHaveReturnedWith(resolver);
      expect(resolver.resolve).toHaveBeenCalled();
      expect(resolver.resolve).toHaveReturned();
      expect(sources).toMatchSnapshot();

      resolver.setFrom.mockClear();
    });
  });

  describe('when setFrom method called', () => {
    beforeEach(() => {
      resolver.sources = [];
      resolver.setFrom.mockClear();
    });

    it('should throw an error while provided with invalid path', () => {
      expect(() => resolver.setFrom('/fake/path')).toThrow();
      expect(resolver.setFrom).toHaveBeenCalled();
    });

    it('should return the resolver object itself', () => {
      const instance = resolver.setFrom('../stub');

      expect(resolver.setFrom).toHaveBeenCalled();
      expect(resolver.setFrom).toHaveReturned();
      expect(instance).toBeTruthy();
      expect(instance).toBeInstanceOf(Resolver);
    });

    it('should change the sources property', () => {
      resolver.setFrom('../stub');

      expect(resolver.setFrom).toHaveBeenCalled();
      expect(resolver.setFrom).toHaveReturned();
      expect(resolver.sources).not.toEqual([]);
    });

    it('should match the sources snapshot', () => {
      resolver.setFrom('../stub');

      expect(resolver.setFrom).toHaveBeenCalled();
      expect(resolver.setFrom).toHaveReturned();
      expect(resolver.sources).toMatchSnapshot();
    });
  });
});
