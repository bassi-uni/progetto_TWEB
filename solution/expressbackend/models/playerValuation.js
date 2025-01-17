/**
 * player_valuations(player_id,last_season,datetime,
 * date,dateweek,market_value_in_eur,n,current_club_id,
 * player_club_domestic_competition_id)
 */

const mongoose = require('mongoose');

const { getDateWeek } = require('../utils/constants');

const playerValuationSchema =new mongoose.Schema(
  {
    player_id: {
      type: mongoose.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    last_season: {
      type: Number,
      required: true,
    },
    datetime: {
      type: Date,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    dateweek: {
      type: Date,
      required: true,
    },
    market_value_in_eur: {
      type: Number,
      required: true,
    },

    current_club_id: {
      type: Number,
      required: true,
    },
    player_club_domestic_competition_id: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
playerValuationSchema.pre(/save|create/, function (next) {
  this.dateweek = getDateWeek(this.date);
  next();
});
const PlayerValuation = mongoose.model(
  'PlayerValuation',
  playerValuationSchema
);
module.exports = PlayerValuation;
