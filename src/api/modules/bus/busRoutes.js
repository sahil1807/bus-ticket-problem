const { Router } = require('express');

const controller = require('./busControllers');
const validaton = require('./busValidation');

const router = Router();
router.post('/reset', controller.reset);
router.get('/openTickets', controller.openTickets);
router.get('/closedTickets', controller.closedTickets);

module.exports = router;
