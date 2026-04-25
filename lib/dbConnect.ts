import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  // Some networks/runtimes struggle with MongoDB SRV + IPv6 resolution.
  // We prefer IPv4 and optionally set public DNS resolvers when available.
  if (process.env.NEXT_RUNTIME !== "edge") {
    try {
      const dns = await import("dns");
      if (typeof dns.setDefaultResultOrder === "function") {
        dns.setDefaultResultOrder("ipv4first");
      }
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch {
        // Some runtimes do not allow overriding resolvers.
      }
    } catch {
      // Ignore if dns module is unavailable.
    }
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      family: 4,
      serverSelectionTimeoutMS: 15000,
    };

    console.log("Connecting to MongoDB...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("MongoDB connection established.");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
