const { MongoClient } = require('mongodb');

require('dotenv').config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const assert = require('assert');

// Code that is generating the seats.
// ----------------------------------
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
