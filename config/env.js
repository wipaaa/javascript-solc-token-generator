require('dotenv').config();

module.exports = {
  SOLC_VERSION: process.env.SOLC_VERSION ?? 'v0.5.12+commit.7709ece9',
  WEB3_PROVIDER_LOCAL: process.env.WEB3_PROVIDER_LOCAL,
  WEB3_PROVIDER_REMOTE: process.env.WEB3_PROVIDER_REMOTE,
  WEB3_ACC_PRIVATE_KEY: process.env.WEB3_ACC_PRIVATE_KEY,
};
