const { Response } = require('../utils');
const Logger = require('../config/Logger');
const busRoutes = require('./modules/bus/busRoutes.js');
const bookingRoutes = require('./modules/booking/bookingRoutes.js');

exports.loadRoutes = (app, prefix) => {
  app.use(`${prefix}/bus`, busRoutes);
  app.use(`${prefix}/bus/booking`, bookingRoutes);

  app.get('/status', (req, res) => {
    Logger.log('info', 'checking status', { status: 1 });

    Response.success(res);
  });
};
