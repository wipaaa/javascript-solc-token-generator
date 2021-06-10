const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const ContractError = require('../exceptions/ContractError');

const {
  WEB3_PROVIDER_LOCAL,
  WEB3_ACC_ADDRESS,
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
    this.instance.defaultAccount = WEB3_ACC_ADDRESS;

    return this;
  };

  deploy = async (source, option = {}) => {
    if (typeof source !== 'object') {
      const message = 'Expected contract parameter to be object.';
      throw new ContractError(message);
    }

    if (!source.abi && !source.bytecode) {
      const message = 'Please provide a valid contract object.';
      throw new ContractError(message);
    }

    const { from = null, gas = null, gasPrice = null } = option;

    const { abi, bytecode, metadata } = source;
    const contract = new this.instance.eth.Contract(abi);

    // gas and gas price estimation
    const GAS = gas ?? (await this.#_getGasEstimation(bytecode, from));
    const GAS_PRICE = gasPrice ?? (await this.#_getGasPrice());
    const GAS_IN_HEX = await this.instance.utils.toHex(GAS);
    const GAS_PRICE_IN_HEX = await this.instance.utils.toHex(GAS_PRICE);

    const receipt = await contract
      .deploy({
        data: `0x${bytecode}`,
      })
      .send({
        from: from ?? this.accounts[0],
        gas: GAS_IN_HEX,
        gasPrice: GAS_PRICE_IN_HEX,
      });

    return { bytecode, receipt };
  };

  disconnect = () => {
    if (!this.instance.currentProvider) {
      return null;
    }

    this.instance.currentProvider.engine.stop();
    return null;
  };

  #_getGasEstimation = async (bytecode, address) => {
    const from = address ?? this.accounts[0];
    const data = bytecode;

    const gas = await this.instance.eth.estimateGas({
      from,
      data,
    });

    return gas;
  };

  #_getGasPrice = async () => {
    const gasPrice = await this.instance.eth.getGasPrice();
    return gasPrice;
  };
};
