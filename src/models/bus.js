/* eslint-disable no-use-before-define */
const mongoose = require('mongoose');

const busSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: 'hv travels',
      required: true,
      maxlength: 32,
    },
    busNumber: {
      type: String,
      trim: true,
      default: 'KA01HG2323',
      required: true,
      maxlength: 32,
    },
    seatsAvailable: {
      type: Number,
      trim: true,
      default: 40,
      maxlength: 32,
    },
    bookedSeat: {
      type: [],
    },
    numberOfSeats: {
      type: Number,
      trim: true,
      default: 40,
      maxlength: 32,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    journeyDate: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },
);
busSchema.statics.getActiveBusJourney = async function getActiveBusJourney() {
  return BusModel.findOne({
    isAvailable: true,
  });
};

busSchema.statics.archiveBusJourney = async function getActiveBusJourney() {
  return BusModel.findOneAndUpdate(
    {
      isAvailable: true,
    },
    {
      $set: {
        isAvailable: false,
      },
    },
  );
};

busSchema.statics.reserveSeats = async function getActiveBusJourney(ticketSequence) {
  return BusModel.findOneAndUpdate(
    {
      isAvailable: true,
    },
    {
      $push: { bookedSeat: ticketSequence },
    },
  );
};

busSchema.statics.cancelSeats = async function getActiveBusJourney(ticketSequence) {
  return BusModel.findOneAndUpdate(
    {
      isAvailable: true,
    },
    {
      $pull: { bookedSeat: { $in: ticketSequence } },
    },
    { multi: true },
  );
};
const BusModel = mongoose.model('Bus', busSchema);
module.exports = BusModel;
