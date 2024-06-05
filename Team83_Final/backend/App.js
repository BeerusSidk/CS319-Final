var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());

const port = "8080";
const host = "localhost";

const { MongoClient } = require("mongodb");
const url = "mongodb://127.0.0.1:27017";
const dbName = "final";
const client = new MongoClient(url);
const db = client.db(dbName);

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});


app.get("/food/popular", async (req, res) => {
  try {
    await client.connect();
    console.log("Node connected successfully to MongoDB");

    const results = await db
      .collection("food")
      .find({ isPopular: true })
      .toArray();
    console.log("Popular robots:", results);

    if (!results.length) {
      res.status(404).send("No popular food found");
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching popular robots:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/food/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const results = await db
      .collection("food")
      .find({ category: category })
      .toArray();
    console.log("Food items of category:", results);

    if (!results.length) {
      res.status(404).send("No food items found for the given category");
    } else {
      res.status(200).json(results);
    }
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/food/:id", async (req, res) => {
  try {
    const foodId = parseInt(req.params.id);
    const food = await db.collection("food").findOne({ id: foodId });

    if (!food) {
      res.status(404).send("Food item not found");
    } else {
      res.status(200).json(food);
    }
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.get("/reviews/:id", async (req, res) => {
  try {
    const foodId = parseInt(req.params.id);

    const comments = await db
      .collection("reviews")
      .find({ foodId: foodId })
      .toArray();

    if (!comments.length) {
      res.status(404).send("No comments found for the given food ID");
    } else {
      res.status(200).json(comments);
    }
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).send("Internal Server Error");
  }
});


app.post("/contributions", async (req, res) => {
  try {
    const { dishName, category, description, ingredients, imageUrl } = req.body;

    const ingredientsArray = ingredients
      .split(",")
      .map((ingredient) => ingredient.trim());

    const lastContribution = await db
      .collection("contributions")
      .find()
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    const newId =
      lastContribution.length === 0 ? 1 : lastContribution[0].id + 1;

    const newContribution = {
      id: newId,
      dishName,
      category,
      description,
      ingredients: ingredientsArray,
      imageUrl,
    };

    await db.collection("contributions").insertOne(newContribution);

    // Respond with a success message
    res.status(200).send("Contribution added successfully");
  } catch (error) {
    console.error("Error adding contribution:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/reviews/:id", async (req, res) => {
  try {
    const foodId = parseInt(req.params.id);
    const { comment, rating, reviewer } = req.body;
    const existingReview = await db.collection("reviews").findOne({ foodId: foodId, reviewer: reviewer });

    if (existingReview) {
      const putRequest = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment, rating: rating, reviewer: reviewer }),
      };

      const putResponse = await fetch(`http://localhost:8080/reviews/${foodId}`, putRequest);
      const result = await putResponse.text();

      res.status(200).send(result);
    }
    else {
      const lastReview = await db
        .collection("reviews")
        .find()
        .sort({ id: -1 })
        .limit(1)
        .toArray();
      const newReviewId = lastReview.length === 0 ? 1 : lastReview[0].id + 1;

      const newReview = {
        id: newReviewId,
        foodId: foodId,
        reviewer: reviewer,
        rating: rating,
        comment: comment,
      };

      await db.collection("reviews").insertOne(newReview);

      res.status(201).send("Review added successfully");
    }
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.put("/reviews/:id", async (req, res) => {
  try {
    const foodId = parseInt(req.params.id);
    const { comment, rating, reviewer } = req.body;

    // Update the review in the database
    const updatedReview = await db.collection("reviews").findOneAndUpdate(
      { foodId: foodId, reviewer: reviewer },
      { $set: { comment: comment, rating: rating } },
      { returnOriginal: false }
    );

    if (updatedReview.value) {
      res.status(200).send("Review updated successfully");
    } else {
      res.status(404).send("Review not found");
    }
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/reviews/:id", async (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);

    const result = await db.collection("reviews").deleteOne({ id: reviewId });

    if (result.deletedCount === 0) {
      res.status(404).send("Review not found");
    } else {
      res.status(200).send("Review deleted successfully");
    }
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).send("Internal Server Error");
  }
});
