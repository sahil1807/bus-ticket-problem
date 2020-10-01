const Logger = require('../../../config/Logger');
const { Response } = require('../../../utils');
const BusModel = require('../../../models/bus');

class BusController {
  /**
   * Function for resetting user
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async reset(req, res) {
    Logger.log('info', 'Admin API for reset the bus tickets');
    try {
      // Find if there is any unique active bus document available
      const activeBusJourney = await BusModel.getActiveBusJourney();
      if (activeBusJourney) {
        // Creating a new Bus Entry in database
        await BusModel.create({ journeyDate: Date.now() });
      } else {
        // Archiving previous bus entry in database
        await BusModel.archiveBusJourney();
        // Creating a new bus entry in database
        await BusModel.create({ journeyDate: Date.now() });
      }
      Response.success(res, 'success', req.body);
    } catch (err) {
      Logger.log('error', 'Error encountered while performing Admin API', err);
      Response.fail(res, 'Error encountered while performing Admin API');
    }
  }

  static async openTickets(req, res) {
    Logger.log('info', 'Finding open tickets in the bus');
    try {
      // Find if there is any unique active bus document available
      const openTickets = [];
      const activeBusJourney = await BusModel.getActiveBusJourney();
      if (activeBusJourney) {
        for (let i = 1; i <= activeBusJourney.numberOfSeats; i += 1) {
          if (!activeBusJourney.bookedSeat.includes(i)) {
            openTickets.push(i);
          }
        }
        const response = {
          totalSeats: activeBusJourney.numberOfSeats,
          totalOpenSeats: openTickets.length,
          totalBookedSeat: activeBusJourney.bookedSeat.length,
          openTickets,
        };
        Response.success(res, 'success', response);
      } else {
        Response.fail(res, 'No active bus found');
      }
    } catch (err) {
      Response.fail(res, 'Not able to find out open tickets currently');
    }
  }

  static async closedTickets(req, res) {
    Logger.log('info', 'Admin API for reset the bus tickets');
    // Find if there is any unique active bus document available
    const activeBusJourney = await BusModel.getActiveBusJourney();

    const response = {
      totalSeats: activeBusJourney.numberOfSeats,
      totalOpenSeats: activeBusJourney.numberOfSeats - activeBusJourney.bookedSeat.length,
      totalBookedSeat: activeBusJourney.bookedSeat.length,
      bookedSeat: activeBusJourney.bookedSeat,
    };
    Response.success(res, 'success', response);
  }
}

module.exports = BusController;
