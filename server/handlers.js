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
    res.status(404).json({ status: 404, message: err });
  }

  // close the connection to the database server
  client.close();
  console.log('Disconnected!');
};

const bookSeat = async (req, res) => {
  const { seatId, fullName, email, creditCard, expiration } = req.body;
  console.log('Data: ', req.body);

  if (!fullName) {
    return res.status(400).json({
      status: 400,
      message: 'Please provide a full name.',
    });
  } else if (!email) {
    return res.status(400).json({
      status: 400,
      message: 'Please provide an email address.',
    });
  } else if (!creditCard) {
    return res.status(400).json({
      status: 400,
      message: 'Please provide a credit card number.',
    });
  } else if (!expiration) {
    return res.status(400).json({
      status: 400,
      message: 'Please provide an expiration date.',
    });
  }

  // creates a new client
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to the client
    await client.connect();
    console.log('Connecting...');

    // connect to the database named 'theater-seats'
    const db = client.db('theater-seats');
    console.log('Connected!');

    // we are querying on the seatId
    const query = { _id: seatId };
    // contains the values that we which to
    const newValues = {
      $set: { isBooked: true },
    };
    const r = await db.collection('seats').updateOne(query, newValues);

    // confirm that the database found the document we want to update
    assert.strictEqual(1, r.matchedCount);
    // confirm that the database updated the document
    assert.strictEqual(1, r.modifiedCount);

    // on success, send
    res.status(204).json({
      status: 204,
      success: true,
    });
  } catch (err) {
    console.log(err.stack);
    // on failure, send
    res.status(500).json({ status: 500, message: err.message });
  }

  // close the connection to the database server
  client.close();
  console.log('Disconnected!');
};

module.exports = { getSeats, bookSeat };
