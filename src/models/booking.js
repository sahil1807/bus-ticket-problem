/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const passengerSchema = new Schema({
  name: String,
  sequence: Number,
});

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      default: Math.random()
        .toString(36)
        .slice(6)
        .toUpperCase(),
    },
    bookingStatus: {
      type: String,
      enum: ['booked', 'cancelled'],
      default: 'booked',
    },
    price: {
      type: String,
    },
    passengers: {
      type: Number,
      default: 1,
    },
    seatNumbers: [],
    passengerDetails: [passengerSchema],
    busJourneyId: { type: Schema.Types.ObjectId, ref: 'Bus' },
  },
  { timestamps: true },
);
bookingSchema.statics.getBookingDetails = async function getBookingDetails(query) {
  return BookingModel.findOne(query, {
    _id: 0,
    bookingId: 1,
    bookingStatus: 1,
    'passengerDetails.name': 1,
    'passengerDetails.sequence': 1,
    createdAt: 1,
  });
};

bookingSchema.statics.updateStatus = async function getActiveBusJourney(bookingId, bookingStatus) {
  return BookingModel.findOneAndUpdate(
    {
      bookingId,
    },
    {
      $set: { bookingStatus },
    },
  );
};

const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports = BookingModel;
