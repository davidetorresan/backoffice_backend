import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });
import express from "express";
import { drawServerOpening } from "./config/logs";
import api from "./routes/v1/api";
import mongoose from "mongoose";

const uri: any = process.env.MONGO_URI;

mongoose.connect(uri).then(() => {
  console.log("Connected to MongoDB @ 27017");
});

const app: express.Application = express();

app.use(express.json());

app.use("/api/v1", api);

// Server setup
app.listen(process.env.PORT, () => {
  console.log(drawServerOpening(`http://localhost:${process.env.PORT}/`));
});
