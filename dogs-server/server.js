require('dotenv').config();
const express = require("express");
const api = require("./api.js");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api", api);

app.listen(3000, () => console.log("running on http://localhost:3000"));
