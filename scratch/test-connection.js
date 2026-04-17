const mongoose = require('mongoose');

const uri = "mongodb://rudrasingh1108_db_user:rudr%40110122@ac-xudjmh9-shard-00-00.cddx75z.mongodb.net:27017,ac-xudjmh9-shard-00-01.cddx75z.mongodb.net:27017,ac-xudjmh9-shard-00-02.cddx75z.mongodb.net:27017/?ssl=true&authSource=admin&retryWrites=true&w=majority";

console.log("Attempting to connect to MongoDB using standard connection string...");

mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("SUCCESS: Connected to MongoDB!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILURE: Connection failed.");
    console.error(err);
    process.exit(1);
  });
