const express = require("express");
const { db } = require('../firebase/firebase');
const { Timestamp } = require("firebase-admin/firestore");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const matchRecordRef = db.collection("matchRecord");

        const matchRecordData = await matchRecordRef.orderBy("timestamp", "desc").get();

        if(matchRecordData.empty) {
            return res.status(200).json({ message: "No Match Record Found.", matchRecordData: []});
        }

        const matchRecord = matchRecordData.docs.map((doc) => ({
            id: doc.id,
            player1: {
                playerId: doc.data().player1?.playerId,
                name: doc.data().player1?.name,
                score: doc.data().player1?.score
            },
            player2: {
                playerId: doc.data().player2?.playerId,
                name: doc.data().player2?.name,
                score: doc.data().player2?.score
            },
            timestamp: doc.data().timestamp ? doc.data().timestamp.toDate() : null
        }));

        res.status(200).json({matchRecord});
    } catch (error) {

    }
})


router.post("/", async (req, res) => {
   try {
        const { player1, player2,} = req.body;

        if(!player1 || !player2) {
            return res.status(400).json({ error: "Missing player data"});
        }

        const matchRecord = {
            player1,
            player2,
            timestamp: Timestamp.now()
        };

        const docRef = await db.collection("matchRecord").add(matchRecord);
        res.status(201).json({ message: "Match record added", id:docRef.id});
   } catch (error) {
        console.error("Error adding match record:", error);
        res.status(500).json({ error: "Failed to add match record" });
   }
});

module.exports = router;
