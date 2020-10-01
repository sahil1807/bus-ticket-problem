const mongoose = require('mongoose');

const config = require('../config');

module.exports = async function() {
  // Or:
  try {
    await mongoose.connect(config.mongodb.connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (error) {
    console.log('Error in Mongoose initialization', error);
    process.exit(1);
  }
  mongoose.connection.on('connected', () => {
    console.log('Mongoose default connection is connected ');
    process.exit(0);
  });

  mongoose.connection.on('error', err => {
    console.log(`Mongoose default connection has occurred ${err} error`);
    process.exit(0);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose default connection is disconnected');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose default connection is disconnected due to application termination');
      process.exit(0);
    });
  });
};

module.exports.init = function() {
  // eslint-disable-next-line global-require
  const serviceRoleModel = require('../models/serviceRole');
  serviceRoleModel.init();
};
