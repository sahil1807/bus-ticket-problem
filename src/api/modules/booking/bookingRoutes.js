const { Router } = require('express');

const controller = require('./bookingControllers');
const validaton = require('./bookingValidation');

const router = Router();
router.post('/', validaton.reserveTicketSchema, controller.reserveTicket);
router.put('/:bookingId', validaton.cancelTicketSchema, controller.cancelTicket);
router.get('/:bookingId', controller.ticketStatus);

module.exports = router;
