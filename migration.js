const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run(`
        create table if not exists Artist (
            id integer primary key,
            name text not null,
            date_of_birth text not null,
            biography text not null,
            is_currently_employed integer default 1
        );
    `);
});