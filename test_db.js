// This script inserts data to Trips table
// in the purporse of testing

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.run(`
insert into Trips (description, trip_start, trip_end, total_cash)
values ($description, $dateStart, $dateEnd, $totalCash);
`, {
$description: "Test Trip",
$dateStart: "2020-01-01",
$dateEnd: "2020-31-12",
$totalCash: 1000000,
}, function(err) {
  
  if (err) {
    console.log(err);
 
  } else {
    console.log(`Newly Trip with ID: ${this.lastID} is created`);
  }
});

