const { MongoClient } = require('mongodb');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const assert = require('assert');

// *** Below code was taken from routes.js ***
const NUM_OF_ROWS = 8;
const SEATS_PER_ROW = 12;

const seats = {};
const row = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
for (let r = 0; r < row.length; r++) {
  for (let s = 1; s < 13; s++) {
    seats[`${row[r]}-${s}`] = {
      price: 225,
      isBooked: false,
    };
  }
}

// ----------------------------------
//////// HELPERS
const getRowName = (rowIndex) => {
  return String.fromCharCode(65 + rowIndex);
};

const randomlyBookSeats = (num) => {
  const bookedSeats = {};

  while (num > 0) {
    const row = Math.floor(Math.random() * NUM_OF_ROWS);
    const seat = Math.floor(Math.random() * SEATS_PER_ROW);

    const seatId = `${getRowName(row)}-${seat + 1}`;

    bookedSeats[seatId] = true;

    num--;
  }

  return bookedSeats;
};

const bookedSeatsArray = randomlyBookSeats(30);

Object.keys(bookedSeatsArray).forEach((key) => {
  seats[key].isBooked = true;
});

Object.values(seats).forEach((seat, index) => {
  let keysArray = Object.keys(seats);
  seat._id = keysArray[index];
});

const batchImport = async () => {
  // declare a variable called `client`, and assign it the `MongoClient()
  const client = await MongoClient(MONGO_URI, options);

  try {
    // connect to the client
    await client.connect();
    console.log('Connecting...');

    // connect to the database named 'theater-seats'
    const db = client.db('theater-seats');
    console.log('Connected!');

    // create a new collection named 'seats' and insert body from req
    const r = await db.collection('seats').insertMany(Object.values(seats));
    console.log('Theater seats length is: ', Object.values(seats).length);

    assert.strictEqual(Object.values(seats).length, r.insertedCount);

    // on success, send
    console.log('Success!', '\n', { status: 201 });
  } catch (err) {
    // on failure, send
    console.log(
      'Error: ',
      '\n',
      { status: 500, message: err.message },
      '\n',
      `Stack error: ${err.stack}`
    );
  }

  // close the connection to the database server
  client.close();
  console.log('Disconnected!');
};

batchImport();
