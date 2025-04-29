require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { SERVER_PORT } = require("./src/config/serverConfig");
const leaderboardRoutes = require("./src/Routes/leaderboards");
const matchRecordRoutes = require("./src/Routes/matchRecord");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/leaderboard", leaderboardRoutes);
app.use("/matchRecord", matchRecordRoutes)

console.log(process.env.PORT);
console.log(`Server port: ${SERVER_PORT}`);


app.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
})
// Author: Jimboy
