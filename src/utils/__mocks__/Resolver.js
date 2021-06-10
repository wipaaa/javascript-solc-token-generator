const fs = require('fs');
const path = require('path');

const _getActualPath = (pathTo) => {
  return path.resolve('src', pathTo);
};

export default jest.fn().mockImplementation(function () {
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

  this.resolve = jest.fn().mockImplementation(() => {
    const sources = this.sources;
    this.sources = [];

    return sources;
  });

  this.setFrom = jest.fn().mockImplementation((pathToDirectory) => {
    const actualPath = _getActualPath(pathToDirectory);

    if (!fs.existsSync(actualPath)) {
      const message = `Directory isn't exists at: ${pathToDirectory}.`;
      throw new Error(message);
    }

    this.sources = fs.readdirSync(actualPath).map((source) => {
      const { extension } = this.defaults;

      return {
        name: source.replace(extension.from, extension.to),
        content: `This is the ${source} content.`,
        path: actualPath,
      };
    });

    return this;
  });
});
