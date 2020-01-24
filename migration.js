const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run(`
        create table if not exists Trips (
            id integer primary key,
            description text not null,
            trip_start text not null,
            trip_end text not null,
            total_cash integer not null
        );
    `);
    db.run(`
        create table if not exists Spends (
            id integer primary key,
            trip_id integer not null,
            date text not null,
            spends_sum integer not null
        );
    `);
    console.log('Database is created');
});