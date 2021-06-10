const fs = require('fs');
const path = require('path');

const _getActualPath = (pathTo) => {
  return path.resolve('src', pathTo);
};

module.exports = class Resolver {
  constructor() {
    this.sources = [];
    this.defaults = {
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
  }

  resolve = jest.fn().mockImplementation(() => {
    const sources = this.sources;
    this.sources = [];

    return sources;
  });

  setFrom = jest.fn().mockImplementation((pathToDirectory) => {
    const actualPath = _getActualPath(pathToDirectory);

    if (!fs.existsSync(actualPath)) {
      const message = `Directory isn't exists at: ${pathToDirectory}.`;
      throw new Error(message);
    }

    this.sources = fs.readdirSync(actualPath).map((source) => {
      const { extension } = this.defaults;

      return {
        name: source.replace(extension.from, extension.to),
        content: null,
        path: actualPath,
      };
    });

    return this;
  });
};
