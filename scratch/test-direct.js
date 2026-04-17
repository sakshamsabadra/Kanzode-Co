const mongoose = require('mongoose');

const uri = "mongodb://rudrasingh1108_db_user:rudr%40110122@ac-xudjmh9-shard-00-00.cddx75z.mongodb.net:27017/test?ssl=true&authSource=admin&directConnection=true";

console.log("Attempting direct connection to a single shard...");

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS: Connected to shard!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILURE: Connection failed.");
    console.error(err);
    process.exit(1);
  });
