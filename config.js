var config = {};
config.db = {};

config.db.type = 'mysql';
config.db.charset = 'utf8';

config.db.username = 'mtrapani';
config.db.password = 'admin123';
config.db.host = 'dbserver.engr.scu.edu';
config.db.dbname = 'sdb_mtrapani'; // DB name

config.db.listings_tbl = 'listings'; // table name
// config.db.another_tbl = 'next_table'; // ...

// export
module.exports = config;
