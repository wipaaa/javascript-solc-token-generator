const Web3 = require('web3');
const Provider = require('../src/utils/Provider');

const provider = new Provider();

describe('Provider utility', () => {
  describe('when instantiated', () => {
    it('should be a Replacer instance', () => {
      expect(provider).not.toBeFalsy();
      expect(provider).not.toBeUndefined();
      expect(provider).toBeInstanceOf(Provider);
    });
  });

  describe('when attemp to connect to network', () => {
    let result;

    afterAll(() => result.disconnect());

    beforeAll(async () => {
      result = await provider.connect();
      return result;
    });

    it('should return Provider instance', async () => {
      expect(result).not.toBeFalsy();
      expect(result).not.toBeUndefined();
      expect(result).toBeInstanceOf(Provider);
    });

    it('should create the Web3 instance at instance property', async () => {
      expect(result.instance).not.toBeFalsy();
      expect(result.instance).not.toBeUndefined();
      expect(result.instance).toBeInstanceOf(Web3);
    });

    it('should create an array of accounts', async () => {
      expect(result.accounts).not.toBeFalsy();
      expect(result.accounts).not.toBeUndefined();
      expect(result.accounts.length).toBeGreaterThan(0);
    });
  });
});
