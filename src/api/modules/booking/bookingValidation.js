const { celebrate, Joi } = require('celebrate');

module.exports = {
  reserveTicketSchema: celebrate({
    body: {
      price: Joi.number().required(),
      passengers: Joi.number().required(),
      seatNumbers: Joi.array().required(),
      passengerDetails: Joi.array().required(),
    },
  }),
  cancelTicketSchema: celebrate({
    body: {
      status: Joi.string()
        .valid('cancelled')
        .required(),
    },
  }),
};
