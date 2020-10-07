'use strict';

const { MongoClient } = require('mongodb');
const assert = require('assert');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const getSeats = async (req, res) => {
  // creates a new client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to the client
    await client.connect();
    console.log('Connecting...');

    // connect to the database named 'theater-seats'
    const db = client.db('theater-seats');
    console.log('Connected!');

    const seats = await db.collection('seats').find().toArray();
    const response = {};

    seats.forEach((seat) => {
      response[seat._id] = seat;
    });

    // on success, send
    res.status(200).json({
      seats: response,
      numOfRows: 8,
      seatsPerRow: 12,
    });
  } catch (err) {
    console.log(err.stack);
    // on failure, send
    res.status(404).json({ status: 404, err });
  }

  // close the connection to the database server
  client.close();
  console.log('Disconnected!');
};

module.exports = { getSeats };
