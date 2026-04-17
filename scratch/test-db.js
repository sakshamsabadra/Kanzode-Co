const mongoose = require('mongoose');
const dns = require('dns');

// Test with SRV
const uri = "mongodb+srv://rudrasingh1108_db_user:rudr%40110122@cluster0.cddx75z.mongodb.net/?appName=Cluster0";

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
