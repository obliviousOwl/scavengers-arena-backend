const express = require("express");
const { db, admin } = require("../firebase/firebase");
const { Timestamp } = require("firebase-admin/firestore");
const router = express.Router();

router.get("/", async (req, res) => {
    try{
        const leaderBoardRef = db.collection("leaderboard");

        const leaderboardData = await leaderBoardRef.orderBy("score", "desc").limit(10).get();

        if(leaderboardData.empty){
            return res.status(200).json({message: "No leaderboard data found.", leaderboard:[]});
        }

        const leaderboard = leaderboardData.docs.map((doc) => ({
            id: doc.id,
            playerId: doc.data().playerId,
            name: doc.data().name,
            score: doc.data().score,
            timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null
        }));

        res.status(200).json({leaderboard});

    }
    catch(error) {
        console.log("Error fetching leaderboard:", error);
        res.status(500).json({ error: "Internal server error"});
    }
});


router.post("/", async(req, res) => {

    const { playerId, name, score } = req.body;
    if(!playerId || !name || typeof score !== "number"){
        return res.status(400).json({ error: "Missing or invalid playerId, name, or score."})
    }
    try {
        const leaderboardRef  = db.collection("leaderboard");

        const newEntry = {
            playerId,
            name,
            score,
            timestamp: Timestamp.now()
        };

        const docRef = await leaderboardRef.add(newEntry);

        res.status(201).json({
            message:"Leaderboard entry added successfully.",
            id: docRef.id,
            ...newEntry
        })

    } catch (error) {
        console.error("Error adding leaderboard entry:" , error);
        res.status(500).json({ error: "Internal server error" })
    }
});

module.exports = router;
