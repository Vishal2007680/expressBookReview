const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Register a new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "Customer successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 1 & 10: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Task 2 & 11: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn]);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Task 3 & 12: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  let matchingBooks = [];
  for (let id in books) {
    if (books[id].author === author) {
      matchingBooks.push({ isbn: id, ...books[id] });
    }
  }
  res.send(JSON.stringify(matchingBooks, null, 4));
});

// Task 4 & 13: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let matchingBooks = [];
  for (let id in books) {
    if (books[id].title === title) {
      matchingBooks.push({ isbn: id, ...books[id] });
    }
  }
  res.send(JSON.stringify(matchingBooks, null, 4));
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// Tasks 10-13: Async / Axios implementations
async function getAllBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getBookByISBNAsync(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getBookByAuthorAsync(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getBookByTitleAsync(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

module.exports.general = public_users;
