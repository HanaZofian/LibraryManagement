import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// add new book
router.post("/", async (req, res) => {
  try {
    const collection = await db.collection("book");

    // Check if ISBN already exists
    const existingBook = await collection.findOne({ isbn: req.body.isbn });
    if (existingBook) {
      return res.status(400).send({ message: "This ISBN exists. Please use a unique ISBN." });
    }

    const newBookDocument = {
      title: req.body.title,
      author: req.body.author,
      isbn: req.body.isbn,
      publicationYear: req.body.publicationYear,
      genre: req.body.genre,
      copies: req.body.copies,
      availability: req.body.availability,
    };

    const result = await collection.insertOne(newBookDocument);
    res.status(201).send(result); // status 201 = created
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding record");
  }
});



// get book by category
router.get("/", async (req, res) => {
  try {
    const collection = await db.collection("book");
    const genre = req.query.genre;

    let query = {};
    if (genre) {
      query = { genre: { $regex: new RegExp(`^${genre}$`, "i") } }; 
    }

    const result = await collection.find(query).toArray();

    if (result.length === 0) {
      res.status(404).send("No books found");
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).send("Server error");
  }
});

// edit book
router.patch("/edit/:id", async (req, res) => {
  try {
    const bookId = new ObjectId(req.params.id);
    const newIsbn = req.body.isbn;

    const collection = await db.collection("book");

    // Fetch the existing book by id
    const existingBookById = await collection.findOne({ _id: bookId });

    if (!existingBookById) {
      return res.status(404).json({ message: "Book not found" });
    }

    // If newIsbn is different from old ISBN, check for duplicates
    if (existingBookById.isbn !== newIsbn) {
      const existingBookWithNewIsbn = await collection.findOne({ isbn: newIsbn });
      if (existingBookWithNewIsbn) {
        return res.status(400).json({ message: "This ISBN exists. Please use a unique ISBN." });
      }
    }

    const query = { _id: bookId };
    const updates = {
      $set: {
        title: req.body.title,
        author: req.body.author,
        isbn: newIsbn,
        publicationYear: req.body.publicationYear,
        genre: req.body.genre,
        copies: req.body.copies,
        availability: req.body.availability,
      },
    };

    const result = await collection.updateOne(query, updates);

    res.status(200).json({ message: "Book updated successfully", result });
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).send("Error updating book");
  }
});



// get book by ObjectId
router.get("/:id", async (req, res) => {
  try {
    const collection = await db.collection("book");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) res.status(404).send("Not found");
    else res.status(200).send(result);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).send("Error fetching book");
  }
});

// delete book by ObjectId
router.delete("/:id", async (req, res) => {
  try {
    const query = { _id: new ObjectId(req.params.id) };

    const collection = db.collection("book");
    let result = await collection.deleteOne(query);

    res.send(result).status(200);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting record");
  }
});

export default router;

