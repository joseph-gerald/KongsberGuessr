import mongoose from 'mongoose';
import { MongoClient } from "mongodb";

const url = process.env.MONGODB_URI || "mongodb://localhost:27017";
const client = new MongoClient(url);

client.connect();

mongoose.connect(url);

export default client;