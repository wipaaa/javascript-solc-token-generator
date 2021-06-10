import Resolver from '../Resolver';

const defaults = {
  charset: 'utf-8',
  data: {
    name: null,
    content: null,
    path: null,
  },
  directory: '../../stub',
  extension: {
    from: '.txt',
    to: '.sol',
  },
};

jest.mock('../Resolver');

describe('Resolver utility', () => {
  let resolver = null;

  beforeAll(() => {
    resolver = new Resolver();
  });

  describe('when instantiated', () => {
    it('should be an a truthy', () => {
      expect(resolver).not.toBeFalsy();
      expect(resolver).not.toBeNull();
      expect(resolver).not.toBeUndefined();
    });

    it('should be a valid instance', () => {
      expect(resolver).toBeInstanceOf(Resolver);
    });

    it('should contain a valid property', () => {
      expect(resolver).toHaveProperty('sources', []);
      expect(resolver).toHaveProperty('defaults', defaults);
    });
  });

  describe('when resolve method called', () => {
    afterEach(() => {
      expect(resolver.resolve).toHaveReturned();
    });

    beforeEach(() => {
      resolver.resolve.mockClear();
    });

    it('should not throw any error', () => {
      expect(() => resolver.resolve()).not.toThrow();
    });

    it('should return the sources object', () => {
      resolver.setFrom('../stub');

      const result = resolver.resolve();

      expect(resolver.resolve).toHaveBeenCalled();
      expect(resolver.resolve).toHaveReturned();
      expect(result).toMatchSnapshot();

      resolver.setFrom.mockClear();
    });

    it('should reset the sources property', () => {
      resolver.resolve();
      expect(resolver.sources).toEqual([]);
    });
  });

  describe('when setFrom method called', () => {
    afterEach(() => {
      expect(resolver.setFrom).toHaveBeenCalled();
    });

    beforeEach(() => {
      resolver.setFrom.mockClear();
    });

    it('should throw an error while invalid path specified', () => {
      const fakePath = '/fake/path';
      const errorMessage = `Directory isn't exists at: ${fakePath}.`;

      expect(() => resolver.setFrom('/fake/path')).toThrow();
      expect(() => resolver.setFrom('/fake/path')).toThrow(errorMessage);
    });

    it('should return resolver object while success', () => {
      const actualPath = '../stub';
      const result = resolver.setFrom(actualPath);

      expect(result).toBeInstanceOf(Resolver);
      expect(resolver.setFrom).toHaveBeenCalled();
      expect(resolver.setFrom).toHaveBeenCalledWith(actualPath);
      expect(resolver.setFrom).toHaveReturnedWith(resolver);
    });

    it('should change the sources property with directory files list', () => {
      const actualPath = '../stub';
      const result = resolver.setFrom(actualPath);

      expect(resolver.setFrom).toHaveBeenCalled();
      expect(resolver.setFrom).toHaveBeenCalledWith(actualPath);
      expect(resolver.setFrom).toHaveReturned();
      expect(resolver.sources).toMatchSnapshot();
    });
  });
});
