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
      return res.status(400).json({ message: "User already exists!" });
    }
  }
  return res.status(400).json({ message: "Unable to register user. Missing credentials." });
});

// Helper function to search books dynamically
const findBooksByProperty = (key, value) => {
  let matchingBooks = [];
  for (let id in books) {
    if (books[id][key] === value) {
      matchingBooks.push({ isbn: id, ...books[id] });
    }
  }
  return matchingBooks;
};

// Task 1: Get the book list available in the shop
public_users.get('/', function (req, res) {
  res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
});

// Task 3: Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const results = findBooksByProperty('author', author);
  
  if (results.length > 0) {
    return res.status(200).send(JSON.stringify(results, null, 4));
  } else {
    return res.status(404).json({ message: `No books found for author: ${author}` });
  }
});

// Task 4: Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const results = findBooksByProperty('title', title);

  if (results.length > 0) {
    return res.status(200).send(JSON.stringify(results, null, 4));
  } else {
    return res.status(404).json({ message: `No books found with title: ${title}` });
  }
});

// Task 5: Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  } else {
    return res.status(404).json({ message: "Book not found for the given ISBN" });
  }
});

// Tasks 10-13: Async / Axios implementations with complete error handling
async function getAllBooksAsync() {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch books: ${error.message}`);
  }
}

async function getBookByISBNAsync(isbn) {
  try {
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch book with ISBN ${isbn}: ${error.message}`);
  }
}

async function getBookByAuthorAsync(author) {
  try {
    const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch books by author ${author}: ${error.message}`);
  }
}

async function getBookByTitleAsync(title) {
  try {
    const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch books by title ${title}: ${error.message}`);
  }
}

module.exports.general = public_users;
