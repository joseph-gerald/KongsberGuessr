import mongoose from 'mongoose';
import { MongoClient } from "mongodb";

const url = "mongodb+srv://joseph:testcluster@cluster0.xpyxnt6.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);

client.connect();

mongoose.connect(url);

export default client;