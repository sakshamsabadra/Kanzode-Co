const mongoose = require('mongoose');
const dns = require('dns');

// Force using public DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

const uri = "mongodb+srv://rudrasingh1108_db_user:rudr%40110122@cluster0.cddx75z.mongodb.net/?appName=Cluster0";

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
