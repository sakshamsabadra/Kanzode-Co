const mongoose = require('mongoose');
const dns = require('dns');

// Test with SRV
const uri = "mongodb://rudrasingh1108_db_user:rudr%40110122@ac-xudjmh9-shard-00-00.cddx75z.mongodb.net:27017,ac-xudjmh9-shard-00-01.cddx75z.mongodb.net:27017,ac-xudjmh9-shard-00-02.cddx75z.mongodb.net:27017/?ssl=true&replicaSet=atlas-qz2i1h-shard-0&authSource=admin&retryWrites=true&w=majority";


// Force using Google/Cloudflare DNS to resolve MongoDB SRV records
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  console.log("DNS servers set to 8.8.8.8, 1.1.1.1");
} catch (e) {
  console.warn("Could not set custom DNS servers:", e);
}


async function test() {
  console.log("Testing connection to:", uri);
  
  // Try without any overrides first
  try {
    await mongoose.connect(uri, { bufferCommands: false });
    console.log("SUCCESS: Connected without overrides");
    await mongoose.disconnect();
  } catch (err) {
    console.error("FAILED: Without overrides:", err.message);
  }

  // Try with ipv4first
  console.log("\nSetting ipv4first...");
  if (typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }

  try {
    await mongoose.connect(uri, { bufferCommands: false, family: 4 });
    console.log("SUCCESS: Connected with ipv4first and family:4");
    await mongoose.disconnect();
  } catch (err) {
    console.error("FAILED: With ipv4first:", err.message);
  }
}

test();
