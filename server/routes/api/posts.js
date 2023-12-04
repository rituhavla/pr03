const express = require("express");
const mongodb = require("mongodb");

const router = express.Router();

// Get Posts
router.get("/", async (req, res) => {
  const posts = await loadPostsCollection();
  res.send(await posts.find({}).toArray());
});

// Add Post
router.post("/", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.insertOne({
    text: req.body.text,
    createdAt: new Date(),
  });
  res.status(201).send();
});

// Update Post
router.put("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.updateOne(
    {
      _id: new mongodb.ObjectId(req.params.id),
    },
    {
      $set: { text: req.body.text },
    }
  );
  res.status(200).send({});
});

// Delete Post
router.delete("/:id", async (req, res) => {
  const posts = await loadPostsCollection();
  await posts.deleteOne({ _id: new mongodb.ObjectId(req.params.id) });
  res.status(200).send({});
});

async function loadPostsCollection() {
  const client = await mongodb.MongoClient.connect(
    "mongodb+srv://user123:04rKLzL6R0S8CZ5l@pr03db.rf0v4ha.mongodb.net/"
  );

  return client.db("dbname").collection("posts");
}

module.exports = router;
