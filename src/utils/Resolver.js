const fs = require('fs');
const path = require('path');
const NotFoundError = require('../exceptions/NotFoundError');

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

  #_getActualPath = (...pathSegments) => path.resolve('src', ...pathSegments);

  #_getFormattedFilename = (filename) => {
    const { from, to } = this.defaults.extension;
    return filename.replace(from, to);
  };

  #_isNotExists = (pathTo) => !fs.existsSync(this.#_getActualPath(pathTo));

  #_mergeWithDefaultData = (newData) => ({ ...this.defaults.data, ...newData });

  #_pullSources = () => {
    if (!this.sources.length) {
      return this.sources;
    }

    const sources = [...this.sources];
    this.sources = [];

    return sources;
  };

  #_readContentFrom = (pathToFile) => {
    const { charset } = this.defaults;
    const actualPath = this.#_getActualPath(pathToFile);

    return fs.readFileSync(actualPath, charset).toString();
  };

  #_readFilesFrom = (pathToDirectory, callback) => {
    const { charset } = this.defaults;
    const actualPath = this.#_getActualPath(pathToDirectory);

    return fs.readdirSync(actualPath, charset).map(callback);
  };

  #_resolveFromFile = (pathToFile) => {
    if (this.#_isNotExists(pathToFile)) {
      throw new NotFoundError(`File isn't exists at: ${pathToFile}`);
    }

    const name = this.#_getFormattedFilename(path.basename(pathToFile));
    const content = this.#_readContentFrom(pathToFile);

    return this.#_mergeWithDefaultData({
      name,
      content,
      path: path.dirname(pathToFile),
    });
  };

  #_resolveFromSources = () => {
    if (!this.sources.length) {
      return null;
    }

    this.sources.forEach((source, id) => {
      const content = this.#_readContentFrom(source.path);
      this.sources[id] = { ...source, content };
    });

    return null;
  };
};
