import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import { registerRoutes } from "./routes/index.js";
import nodelocalStorage from "node-localstorage";

var app = express();

app.use(logger("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

var localStorage = new nodelocalStorage.LocalStorage("./storage");

registerRoutes(app, localStorage);

var listener = app.listen(8080, function () {
  console.log("Listening on port " + listener.address().port);
});
