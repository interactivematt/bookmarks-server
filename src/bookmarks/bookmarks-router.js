const express = require('express')
const { v4: uuid } = require('uuid')
const { isWebUri } = require('valid-url')
const logger = require('../logger')
const { bookmarks } = require('../store')

const bookmarksRouter = express.Router()
const bodyParser = express.json()

bookmarksRouter
  .route('/bookmarks')
  .get((req,res) => {
    // Getting list of bookmarks
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    // Grabbing bookmark title and content from body
    const { title, url, description=false, rating } = req.body;
    
    // Validation
    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }
    if (!url) {
      logger.error('URL is required');
      return res
        .status(400)
        .send('Invalid data');
    }
    if (!rating) {
      logger.error('Rating is required')
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      logger.error(`Invalid rating '${rating}' supplied`)
      return res.status(400).send(`'rating' must be a number between 0 and 5`)
    }

    if (!isWebUri(url)) {
      logger.error(`Invalid url '${url}' supplied`)
      return res.status(400).send(`'url' must be a valid URL`)
    }

    
    // Adding bookmark to bookmarks list
    const id = uuid();
    const bookmark = {
      id,
      title,
      url,
      description,
      rating
    }
    bookmarks.push(bookmark)

    // Response
    logger.info(`Bookmark with id ${id} created`);
    res
      .status(201)
      .location(`http://localhost:8000/bookmarks/${id}`)
      .json(bookmark);
  })

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req,res) => {
    // Getting specific bookmark
    const { id } = req.params;
    const bookmark = bookmarks.find(c => c.id == id);

    // Validation
    if (!bookmark) {
      logger.error(`Bookmark with id ${id} could not be found.`)
      return res
        .status(404)
        .send(`Bookmark not found.`)
    }

    // Response
    res.json(bookmark)
  })
  .delete((req, res) => {
    // Deleting specific bookmark
    const { id } = req.params;
    const bookmarkIndex = bookmarks.findIndex(c => c.id == id);

    // Validation
    if (!bookmarkIndex === -1) {
      logger.error(`Bookmark with id ${id} could not be found.`)
      return res
        .status(404)
        .send(`Bookmark not found.`)
    }
    // Removing bookmark
    bookmarks.splice(bookmarkIndex, 1)
    logger.info(`Bookmark with id ${id} deleted.`);

    res
      .status(204)
      .end();
  })

module.exports = bookmarksRouter