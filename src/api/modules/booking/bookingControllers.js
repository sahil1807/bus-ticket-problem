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
          Response.fail(res, 'Some of the seats are already reserved previously', 400, 400);
        } else {
          const bookingPayload = {
            bookingId: Math.random()
              .toString(36)
              .slice(6)
              .toUpperCase(),
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
    Logger.log('info', 'Cancelling Ticket');
    try {
      const ticketDetails = await BookingModel.getBookingDetails({ bookingId: req.params.bookingId });
      if (ticketDetails) {
        const updatedDetails = await BookingModel.updateStatus(req.params.bookingId, req.body.status);
        await BusModel.cancelSeats(ticketDetails.seatNumbers);
        ticketDetails.bookingStatus = updatedDetails.bookingStatus;
        Response.success(res, 'success', ticketDetails);
      } else {
        Response.fail(res, 'No active bus found currently');
      }
    } catch (err) {
      Logger.log('error', 'Error encountered while reserving a ticket', err);
      Response.fail(res, 'Error encountered while Reserving ticker');
    }
  }

  /**
   * Controller function to check status of the ticket
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  static async ticketStatus(req, res) {
    try {
      Logger.log('info', 'Finding status of ticket id');
      const ticketDetails = await BookingModel.getBookingDetails({ bookingId: req.params.bookingId });
      if (ticketDetails) {
        Response.success(res, 'success', ticketDetails);
      } else {
        Response.fail(res, 'No ticket found with the given details');
      }
    } catch (err) {
      Logger.log('error', 'Error encountered while reserving a ticket', err);
      Response.fail(res, 'Error encountered while Reserving ticker');
    }
  }
}

module.exports = BookingController;
