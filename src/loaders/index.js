const Logger = require('../config/Logger');
const expressLoader = require('./express');
const mongoLoader = require('./mongoose');

const loader = async function({ expressApp }) {
  await mongoLoader();
  Logger.log('info', '✌️ DB loaded and connected!');

  await expressLoader.loadModules({ app: expressApp });
  Logger.log('info', '✌️ Express loaded');
};

module.exports = loader;
