import express from "express";
import cors from "cors";
import consign from "consign";
import db from './config/db.js';
import mongoose from "mongoose";
require('./config/mongodb.js');

const app = express();

app.use(cors({
    origin: 'http://localhost:8081',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.db = db;
app.mongoose = mongoose;

consign()
    .include("./config/passport.js")
    .then("./config/middleweres.js")
    .then("./api/validation.js")
    .then("./api")
    .then("./schedule")
    .then("./config/routes.js")
    .into(app)

app.listen(3000, () => {
    console.log('\x1b[44m%s\x1b[37m' ,"Foi! Servidor conectado!\x1b[0m")
})
