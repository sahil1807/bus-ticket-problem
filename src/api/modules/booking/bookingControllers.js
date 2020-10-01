const Logger = require('../../../config/Logger');
const { Response } = require('../../../utils');
const BusModel = require('../../../models/bus');
const BookingModel = require('../../../models/booking.js');

class BookingController {
  /**
   * Following function is used to reserve a new ticket
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async reserveTicket(req, res) {
    Logger.log('info', 'Reserving Ticket');
    try {
      const activeBusJourney = await BusModel.getActiveBusJourney();
      if (activeBusJourney) {
        const found = activeBusJourney.bookedSeat.some(r => req.body.seatNumbers.includes(r));
        if (found) {
          Response.fail(res, 'Some of the seats are already reserved previously');
        } else {
          const bookingPayload = {
            bookingId: Math.random()
              .toString(36)
              .slice(6)
              .toUpperCase(),
            price: req.body.price,
            passengers: req.body.passengers,
            seatNumbers: req.body.seatNumbers,
            passengerDetails: req.body.passengerDetails,
            busJourneyId: activeBusJourney._id,
          };
          await BookingModel.create(bookingPayload);
          await BusModel.reserveSeats(req.body.seatNumbers);
          Response.success(res, 'success', bookingPayload);
        }
      } else {
        Response.fail(res, 'No active bus found currently');
      }
    } catch (err) {
      Logger.log('error', 'Error encountered while reserving a ticket', err);
      Response.fail(res, 'Error encountered while Reserving ticker');
    }
  }

  /**
   * Following function is used to cancel an existing ticket
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async cancelTicket(req, res) {
    Logger.log('info', 'Reserving Ticket');
    try {
      const ticketDetails = await BookingModel.getBookingDetails({ bookingId: req.params.bookingId });
      if (ticketDetails) {
        await BookingModel.updateStatus(req.params.bookingId, req.body.status);
        await BusModel.cancelSeats(ticketDetails.seatNumbers);
        Response.success(res, 'success', ticketDetails);
      } else {
        Response.fail(res, 'No active bus found currently');
      }
    } catch (err) {
      Logger.log('error', 'Error encountered while reserving a ticket', err);
      Response.fail(res, 'Error encountered while Reserving ticker');
    }
  }

  static async ticketStatus(req, res) {
    Logger.log('info', 'Finding status of ticket id');
    const ticketDetails = await BookingModel.getBookingDetails({ bookingId: req.params.bookingId });
    Response.success(res, 'success', ticketDetails);
  }
}

module.exports = BookingController;
