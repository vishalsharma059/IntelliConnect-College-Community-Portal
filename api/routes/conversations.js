const router = require("express").Router();
const { Connection } = require("mongoose");
const Conversation = require("../models/Conversation");

// new conv

router.post("/", async (req, res) => {
    console.log("Incoming request to create conversation:", req.body);

    const newConversation = new Conversation({
        members: [req.body.senderId, req.body.receiverId],
    });

    try {
        const savedConversation = await newConversation.save();
        res.status(200).json(savedConversation);
    } catch (err) {
        console.error("Error saving conversation:", err);
        res.status(500).json(err);
    }
});

// get conv

router.get("/:userId", async (req, res) => {
    try {
        const conversation = await Conversation.find({
            members: { $in: [req.params.userId] },
        });
        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
    try {
        const conversation = await Conversation.findOne({
            members: { $all: [req.params.firstUserId, req.params.secondUserId] },
        });
        if (!conversation) {
            return res.status(200).json(null); // Explicitly return null if no conversation exists
        }

        res.status(200).json(conversation);
    } catch (err) {
        res.status(500).json(err);
    }
})


module.exports = router;