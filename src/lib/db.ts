import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const DIRECT_URI =
  process.env.MONGODB_URI_DIRECT ||
  process.env.MONGODB_URI_FALLBACK ||
  process.env.MONGODB_URI_NOSRV;

if (!MONGODB_URI) {
  console.error('CRITICAL: MONGODB_URI is undefined in process.env');
  console.log('Current process.env keys:', Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')));
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env",
  );
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts: Parameters<typeof mongoose.connect>[1] = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    };

    const connectionUri = MONGODB_URI!.split('@')[1] || 'local';
    console.log(`Connecting to MongoDB: ${connectionUri}`);
    cached!.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((m) => {
        console.log('MongoDB connected successfully');
        return m;
      })
      .catch(async (err) => {
        const msg = String(err?.message || err);
        const isSrvIssue =
          msg.includes('querySrv') ||
          msg.includes('ENOTFOUND') ||
          msg.includes('No SRV records') ||
          msg.includes('_mongodb._tcp');
        if (isSrvIssue && DIRECT_URI) {
          console.warn('SRV lookup failed. Falling back to DIRECT MongoDB URI.');
          return mongoose.connect(DIRECT_URI, {
            ...opts,
            directConnection: true,
          });
        }
        throw err;
      });
  }
  
  const mongooseInstance = await cached!.promise;
  cached!.conn = mongooseInstance.connection;
  return cached!.conn;
}

export default dbConnect;
