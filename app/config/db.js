// import mongoose from "mongoose"

// let cached=global.mongoose || {conn: null,promise: null};

// export default async function connectDB() {
//     if(cached.conn) return cached.conn;
//     if (!cached.promise) {
//         cached.promise = (await mongoose.connect(process.env.MONGODB_URI)).then((mongoose)=> mongoose);
//     }
//     try{
//         cached.conn = await cached.promise;
//     } catch (error){
//         console.error("Error connecting to MongoDB:",error);
        
//     }
//     return cached.conn
// }
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null,
  };
}

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;