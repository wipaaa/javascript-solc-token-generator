const { SOLC_VERSION } = require('../../config/env');

module.exports = class Verifier {
  constructor() {
    this.bytecode = {
      blockchain: null,
      compiled: null,
    };
  }

  setBlockchainedBytecode(bytecode) {
    if (!bytecode) {
      const message = 'Please provide a valid blockchained bytecode.';
      throw new TypeError(message);
    }

    return this.#_setBytecode('blockchain', bytecode);
  }

  setCompiledBytecod(bytecode) {
    if (!bytecode) {
      const message = 'Please provide a valid compiled bytecode.';
      throw new TypeError(message);
    }

    return this.#_setBytecode('compiled', bytecode);
  }

  verify() {
    const solcMinor = parseInt(
      SOLC_VERSION.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0]
        .match(/\.\d+/g)[0]
        .slice(1),
      10,
    );

    const solcPatch = parseInt(
      SOLC_VERSION.match(/v\d+?\.\d+?\.\d+?[+-]/gi)[0]
        .match(/\.\d+/g)[1]
        .slice(1),
      10,
    );

    const { blockchain, compiled } = this.bytecode;

    const processedBlockchainBytecode = this.#_processBytecode(
      blockchain,
      solcMinor,
      solcPatch,
    );

    const processedCompiledBytecode = this.#_processBytecode(
      compiled,
      solcMinor,
      solcPatch,
    );

    return processedBlockchainBytecode === processedCompiledBytecode;
  }

  #_processBytecode(bytecode, minor, patch) {
    const MIN_MINOR_VERSION = 4;
    const SWARM_HASH = 'a165627a7a72305820';

    if (minor >= MIN_MINOR_VERSION && patch >= 22) {
      const MEMORY_POINTER = '6080604052';

      const startPoint = bytecode.lastIndexOf(MEMORY_POINTER);
      const endPoint = bytecode.search(SWARM_HASH);

      return bytecode.slice(startPoint, endPoint);
    }

    if (minor >= MIN_MINOR_VERSION && patch >= 7) {
      const MEMORY_POINTER = '6060604052';

      const startPoint = bytecode.lastIndexOf(MEMORY_POINTER);
      const endPoint = bytecode.search(SWARM_HASH);

      return bytecode.slice(startPoint, endPoint);
    }

    return bytecode;
  }

  #_setBytecode(status, bytecode) {
    this.bytecode[status] = bytecode;
    return this;
  }
};
