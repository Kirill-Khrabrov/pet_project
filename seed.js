const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');


db.run(`
insert into Trips (description, trip_start, trip_end, total_cash)
values ($description, $dateStart, $dateEnd, $totalCash);
`, {
$description: "Trip To Yalta",
$dateStart: "2020-24-01",
$dateEnd: "2020-31-01",
$totalCash: 100000,
}, function(err) {

if (err) {
        console.log(err);
 
    } else {
        console.log(`Newly Trip with ID: ${this.lastID} is created`);
      }
    });

