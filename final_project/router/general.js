const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({
      message: "Unable to register user."
    });
  }

  if (isValid(username)) {
    return res.status(404).json({
      message: "User already exists!"
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered. Now you can login"
  });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filtered = {};

  Object.keys(books).forEach(key => {
    if (books[key].author === author) {
      filtered[key] = books[key];
    }
  });

  return res.status(200).json(filtered);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filtered = {};

  Object.keys(books).forEach(key => {
    if (books[key].title === title) {
      filtered[key] = books[key];
    }
  });

  return res.status(200).json(filtered);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).json(books[isbn].reviews);
});


// Task 10
public_users.get('/promisebooks', async function (req, res) {
  const response = await axios.get('http://localhost:5000/');
  return res.status(200).json(response.data);
});

// Task 11
public_users.get('/promiseisbn/:isbn', async function (req, res) {
  const response = await axios.get(
    `http://localhost:5000/isbn/${req.params.isbn}`
  );
  return res.status(200).json(response.data);
});

// Task 12
public_users.get('/promiseauthor/:author', async function (req, res) {
  const response = await axios.get(
    `http://localhost:5000/author/${req.params.author}`
  );
  return res.status(200).json(response.data);
});

// Task 13
public_users.get('/promisetitle/:title', async function (req, res) {
  const response = await axios.get(
    `http://localhost:5000/title/${req.params.title}`
  );
  return res.status(200).json(response.data);
});

module.exports.general = public_users;