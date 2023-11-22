import mongoose from 'mongoose';
import { MongoClient } from "mongodb";

const url = "mongodb://admin:pass@192.168.68.111:27017/?authMechanism=DEFAULT";
const client = new MongoClient(url);

client.connect();

mongoose.connect(url);

export default client;