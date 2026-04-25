const mongoose = require('mongoose');
const dns = require('dns');

// Force using public DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = "mongodb+srv://shivansh1411_db_user:oauUvMUnLZxqW9BD@zode.hwjia9y.mongodb.net/?appName=zode";

async function test() {
  console.log("Testing connection with Google DNS (8.8.8.8)...");
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log("SUCCESS: Connected with custom DNS!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("FAILED even with 8.8.8.8:", err.message);
  }
}

test();
