require('dotenv').config();

module.exports = {
  WEB3_URI_PROVIDER: process.env.WEB3_URI_PROVIDER || 'http://localhost:8545',
  WEB3_USER_PRIVATE_KEY: process.env.WEB3_USER_PRIVATE_KEY,
};
