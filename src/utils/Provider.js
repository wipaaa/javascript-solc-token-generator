const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');

const {
  WEB3_PROVIDER_LOCAL,
  WEB3_ACC_PRIVATE_KEY,
} = require('../../config/env');

module.exports = class Provider {
  constructor() {
    this.instance = null;
  }

  connect = async (option = {}) => {
    const {
      privateKeys = [WEB3_ACC_PRIVATE_KEY],
      providerOrUrl = WEB3_PROVIDER_LOCAL,
    } = option;

    const provider = new HDWalletProvider({
      privateKeys,
      providerOrUrl,
    });

    this.instance = new Web3(provider);
    this.accounts = await this.instance.eth.getAccounts();

    return this;
  };

  deploy = async (source) => {
    if (typeof source !== 'object') {
      const message = 'Expected contract parameter to be object.';
      throw new TypeError(message);
    }

    if (!source.abi && !source.bytecode) {
      const message = 'Please provide a valid contract object.';
      throw new TypeError(message);
    }

    const GAS = 6721975;
    const GAS_PRICE = await this.instance.eth.getGasPrice();
    const GAS_IN_HEX = await this.instance.utils.toHex(GAS);
    const GAS_PRICE_IN_HEX = await this.instance.utils.toHex(GAS_PRICE);

    const { abi, bytecode } = source;
    const contract = new this.instance.eth.Contract(abi);
    const receipt = await contract
      .deploy({
        data: bytecode,
      })
      .send({
        from: this.accounts[0],
        gas: GAS_IN_HEX,
        gasPrice: GAS_PRICE_IN_HEX,
      });

    return receipt;
  };

  stop = () => {
    if (!this.instance.currentProvider) {
      return null;
    }

    this.instance.currentProvider.engine.stop();
    return null;
  };
};
