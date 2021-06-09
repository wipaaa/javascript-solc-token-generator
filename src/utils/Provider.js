const PrivateKeyProvider = require('truffle-privatekey-provider');
const Web3 = require('web3');
const env = require('../../config/env');

module.exports = class Provider {
  constructor() {
    this.instance = null;
  }

  connect = async (option = {}) => {
    const { privateKey = null, providerUrl = null } = option;
    let provider = null;

    if (privateKey) {
      const url = providerUrl ?? env.WEB3_URI_PROVIDER;
      provider = new PrivateKeyProvider(privateKey, url);
    } else {
      const url = env.WEB3_URI_PROVIDER;
      provider = new Web3.providers.HttpProvider(url);
    }

    this.instance = new Web3(provider);
    this.accounts = await this.instance.eth.getAccounts();
  };

  deploy = async (contract) => {
    if (typeof contract !== 'object') {
      const message = 'Expected contract parameter to be object.';
      throw new TypeError(message);
    }

    if (!contract.abi && !contract.bytecode) {
      const message = 'Please provide a valid contract object.';
      throw new TypeError(message);
    }

    const GAS = (await this.instance.eth.getBlock('latest')).gasLimit;
    const GAS_IN_HEX = await this.instance.utils.toHex(GAS);
    const GAS_PRICE = await this.instance.eth.getGasPrice();
    const GAS_PRICE_IN_HEX = await this.instance.utils.toHex(GAS_PRICE);

    const { abi, bytecode } = contract;
    const newContract = new this.instance.eth.Contract(abi);
    const deployedContract = await newContract
      .deploy({
        data: bytecode,
      })
      .send({
        from: this.accounts[0],
        gas: GAS_IN_HEX,
        gasPrice: GAS_PRICE_IN_HEX,
      });

    console.log(deployedContract.options.address);
  };
};
