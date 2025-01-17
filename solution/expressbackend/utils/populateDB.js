const mongoose = require('mongoose');
const fs = require('fs');
const { ObjectId } = require('bson');

const Game = require('../models/game');
// const Appearance = require('../models/appearence');
const GameEvent = require('../models/gameEvent');
// const PlayerValuation = require('../models/playerValuation');
// const GameLineup = require('../models/gameLineup');
const Player = require('../models/player');

const NEW_GAMES_PATH = '../../../datasets/json/new_games.json';
const APPARENCES_PATH = '../../../datasets/json/new_appearances.json';
const GAME_EVENTS_PATH = '../../../datasets/json/game_events.json';
const PLAYER_VALUATIONS_PATH =
  '../../../datasets/json/new_player_valuations.json';
const GAME_LINEUPS_PATH = '../../../datasets/json/game_lineups.json';
const NEW_PLAYER_PATH = '../../../datasets/json/new_players.json';
const GAME_ID_MAPPING_PATH = '../../../datasets/json/games_id_mapping.json';
const PLAYER_ID_MAPPING_PATH = '../../../datasets/json/players_id_mapping.json';

const paths_game_related = [
  APPARENCES_PATH,
  GAME_EVENTS_PATH,
  GAME_LINEUPS_PATH,
];

const paths_player_related = [
  PLAYER_VALUATIONS_PATH,
  APPARENCES_PATH,
  GAME_LINEUPS_PATH,
  GAME_EVENTS_PATH,
];

/**
 * Third step:
 * turn all the number game_id to ObjectId using the mapping file .json
 */

/**
 * Fourth step:
 * importing from compass all the datasets.json
 */

/**
 * Fifth step:
 * turn all the String ObjectId to proper ObjectId type
 * codice completamente preso da chatGPT, è da un  giorno che non riesco a migrare i csv in mongodb come vorrei
 * @param {*} Model
 */
const sanitizeGameId = async (Model) => {
  console.log(`Sanitizing ${Model.modelName} collection`);
  await mongoose.connect(
    'mongodb://127.0.0.1:27017/progetto_TWEB?directConnection=true&appName=mongosh+2.1.1'
  );

  Model.aggregate([
    {
      $addFields: {
        game_id: {
          $toObjectId: '$game_id', // Convert the "game_id" field to ObjectId
        },
      },
    },
  ])
    .then((updatedEvents) => {

      const bulkUpdateOps = updatedEvents.map((event) => ({
        updateOne: {
          filter: { _id: event._id }, // Assuming "_id" is the identifier field
          update: event, // Update with the modified document
        },
      }));

      Model.bulkWrite(bulkUpdateOps)
        .then((result) => {
          console.log('Updated records:', result);
        })
        .catch((err) => {
          console.error('Error updating records:', err);
        });
    })
    .catch((err) => {
      console.error('Error:', err);
    });
};
/**
 * This function sanitizes the player_id field in the provided Mongoose model.
 * It connects to the MongoDB instance, converts the player_id field to ObjectId,
 * and then updates the documents in the collection with the new player_id.
 * If no documents need sanitization, it logs a message and disconnects from the MongoDB instance.
 *
 * @param {Object} Model - The Mongoose model to sanitize.
 */
const sanitizePlayerId = async (Model) => {
  try {
    console.log(`Sanitizing ${Model.modelName} collection`);
    await mongoose.connect('mongodb://127.0.0.1:27017/progetto_TWEB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const updatedEvents = await Model.aggregate([
      {
        $addFields: {
          player_id: {
            $toObjectId: '$player_id', // Convert the "player_id" field to ObjectId
          },
        },
      },
    ]);

    if (updatedEvents.length > 0) {
      const bulkUpdateOps = updatedEvents.map((event) => ({
        updateOne: {
          filter: { _id: event._id }, // Assuming "_id" is the identifier field
          update: { $set: { player_id: event.player_id } }, // Update with the modified "player_id"
        },
      }));

      const result = await Model.bulkWrite(bulkUpdateOps);
      console.log('Updated records:', result);
    } else {
      console.log('No records found for sanitization.');
    }

    await mongoose.disconnect(); // Disconnect from the MongoDB instance
  } catch (err) {
    console.error('Error:', err);
  }
};


/**
 * This function cleans the game datasets by replacing the game_id in each document
 * with the corresponding mapped id from the GAME_ID_MAPPING_PATH file.
 * It throws an error if a game_id is not found in the mapping.
 */
const cleaningGameDatasets = async () => {
  const mapped_ids = require(GAME_ID_MAPPING_PATH);

  paths_game_related.forEach((path) => {
    const dataset = require(path);
    dataset.forEach((doc) => {
      if (!mapped_ids[doc.game_id])
        throw new Error(`Game id ${doc.game_id} not found`);
      doc.game_id = mapped_ids[doc.game_id];
    });
    fs.writeFileSync(path, JSON.stringify(dataset));
  });
  console.log('Fatto game related');
};

/**
 * This function cleans the player datasets by replacing the player_id in each document
 * with the corresponding mapped id from the PLAYER_ID_MAPPING_PATH file.
 * It throws an error if a game_id is not found in the mapping.
 */
const cleaningPlayersDataset = async () => {
  const mapped_ids = require(PLAYER_ID_MAPPING_PATH);

  paths_player_related.forEach((path) => {
    const playerDataset = require(path);
    playerDataset.forEach((doc) => {
      if (!mapped_ids[doc.game_id])
        throw new Error(`Game id ${doc.game_id} not found`);
      doc.player_id = mapped_ids[doc.player_id];
    });

    fs.writeFileSync(path, JSON.stringify(playerDataset));
  });
  console.log('Fatto players related');
};
/**
 * This function cleans the player dataset by replacing the player_id in each document
 * with the corresponding mapped id from the PLAYER_ID_MAPPING_PATH file and then deleting the player_id field.
 */
const cleaningOnlyPlayerDataset = async () => {
  const mapped_ids = require(PLAYER_ID_MAPPING_PATH);

  const playerDataset = require(NEW_PLAYER_PATH);
  playerDataset.forEach((doc) => {
    doc._id = mapped_ids[doc.player_id];
    delete doc.player_id;
  });

  fs.writeFileSync(NEW_PLAYER_PATH, JSON.stringify(playerDataset));
  console.log('Fatto only player');
};

/**
 * This function cleans the game dataset by replacing the game_id in each document
 * with the corresponding mapped id from the GAME_ID_MAPPING_PATH file and then deleting the game_id field.
 */
const cleaningOnlyGameDataset = async () => {
  const mapped_ids = require(GAME_ID_MAPPING_PATH);

  const gamesDataset = require(NEW_GAMES_PATH);
  gamesDataset.forEach((doc) => {
    doc._id = mapped_ids[doc.game_id];
    delete doc.game_id;
  });

  fs.writeFileSync(NEW_GAMES_PATH, JSON.stringify(gamesDataset));
  console.log('Fatto only game');
};

// cleaningPlayersDataset();

/**
 * This function populates the Player collection in the MongoDB instance with data from the NEW_PLAYER_PATH file.
 * It first deletes all existing documents in the collection, then inserts the new players.
 */
const populatePlayers = async () => {
  const players = require(NEW_PLAYER_PATH);
  await mongoose.connect('mongodb://127.0.0.1:27017/progetto_TWEB');

  try {
    await Player.deleteMany({});
    await Player.insertMany(players);
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log('Fatto');
  }
};

/**
 * This function populates the Game collection in the MongoDB instance with data from the NEW_GAMES_PATH file.
 * It first deletes all existing documents in the collection, then inserts the new games.
 */
const populateGames = async () => {
  const players = require(NEW_GAMES_PATH);
  await mongoose.connect('mongodb://127.0.0.1:27017/progetto_TWEB');

  try {
    await Game.deleteMany({});
    await Game.insertMany(players);
  } catch (err) {
    console.log(err);
    throw err;
  } finally {
    console.log('Fatto');
  }
};

const mapObj = require(PLAYER_ID_MAPPING_PATH);
/**
 * This function updates the player_in_id field in the game event dataset with the corresponding mapped id
 * from the PLAYER_ID_MAPPING_PATH file. If a player_in_id is not found in the mapping, it assigns a new ObjectId.
 */
const gameEventFilterPlayer_in_id = async () => {
  const gameEventDataset = require(GAME_EVENTS_PATH);
  gameEventDataset.forEach((doc) => {
    if (doc['player_in_id'] !== undefined && doc['player_in_id'] !== null) {
      if (
        mapObj[doc['player_in_id']] !== null &&
        mapObj[doc['player_in_id']] !== undefined
      ) {
        doc['player_in_id'] = mapObj[doc['player_in_id']];
      } else {
        doc['player_in_id'] = new ObjectId();
      }
    }
  });
  fs.writeFileSync(GAME_EVENTS_PATH, JSON.stringify(gameEventDataset));
};

/**
 * This function updates the player_assist_id field in the game event dataset with the corresponding mapped id
 * from the PLAYER_ID_MAPPING_PATH file. If a player_assist_id is not found in the mapping, it assigns a new ObjectId.
 */
const gameEventFilterPlayer_assist_id = async () => {
  const gameEventDataset = require(GAME_EVENTS_PATH);
  gameEventDataset.forEach((doc) => {
    if (
      doc['player_assist_id'] !== undefined &&
      doc['player_assist_id'] !== null
    ) {
      if (
        mapObj[doc['player_assist_id']] !== null &&
        mapObj[doc['player_assist_id']] !== undefined
      ) {
        doc['player_assist_id'] = mapObj[doc['player_assist_id']];
      } else {
        doc['player_assist_id'] = new ObjectId();
      }
    }
  });
  fs.writeFileSync(GAME_EVENTS_PATH, JSON.stringify(gameEventDataset));
};

/**
 * This function sanitizes the player_in_id field in the provided Mongoose model.
 * It connects to the MongoDB instance, converts the player_in_id field to ObjectId,
 * and then updates the documents in the collection with the new player_in_id.
 * If no documents need sanitization, it logs a message and disconnects from the MongoDB instance.
 *
 * @param {Object} Model - The Mongoose model to sanitize.
 */
const sanitizePlayer_inID = async (Model) => {
  try {
    console.log(`Sanitizing ${Model.modelName} collection`);
    await mongoose.connect('mongodb://127.0.0.1:27017/progetto_TWEB', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const updatedEvents = await Model.aggregate([
      {
        $match: {
          player_in_id: { $ne: null }, // Match documents where player_in_id is not null
        },
      },
      {
        $addFields: {
          player_in_id: {
            $toObjectId: '$player_in_id', // Convert only non-null player_in_id values to ObjectId
          },
        },
      },
    ]);

    if (updatedEvents.length > 0) {
      const bulkUpdateOps = updatedEvents.map((event) => ({
        updateOne: {
          filter: { _id: event._id }, // Assuming "_id" is the identifier field
          update: { $set: { player_in_id: event.player_in_id } }, // Update with the modified "player_id"
        },
      }));

      const result = await Model.bulkWrite(bulkUpdateOps);
      console.log('Updated records:', result);
    } else {
      console.log('No records found for sanitization.');
    }

    await mongoose.disconnect(); // Disconnect from the MongoDB instance
  } catch (err) {
    console.error('Error:', err);
  }
};

function mapPlayerInID(value) {
  if (value === null) return null;
  return ObjectId(value);
}
(async () => {
  // await cleaningPlayersDataset();
  // await cleaningOnlyPlayerDataset();
  // await cleaningOnlyGameDataset();
  // await cleaningGameDatasets();
  //await populatePlayers();
  // await populateGames();
  // await sanitizePlayerId(Appearence);
  // await sanitizeGameId(Apperence);
  // await sanitizePlayerId(GameEvent);
  // await sanitizeGameId(GameEvent);
  // console.time('Sanitizing Valuation');
  // await sanitizePlayerId(PlayerValuation);
  // console.timeEnd('Sanitizing Valuation');
  // console.time('Sanitizing Lineup');
  // await sanitizeGameId(GameLineup);
  // await sanitizePlayerId(GameLineup);
  // console.timeEnd('Sanitizing Lineup');
  // await gameEventFilterPlayer_assist_id();
  // await sanitizePlayer_inID(GameEvent);
})();
