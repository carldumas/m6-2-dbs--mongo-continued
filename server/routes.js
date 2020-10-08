const router = require('express').Router();
const { getSeats, bookSeat } = require('./handlers');

router.get('/api/seat-availability', getSeats);
router.patch('/api/book-seat', bookSeat);

module.exports = router;
