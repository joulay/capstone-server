'use strict';

const express = require('express');
const router = express.Router();

const passport = require('passport');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Bride = require('../models/bride');

router.use(
  passport.authenticate('jwt', { session: false, failWithError: true })
);

router.get('/brides', (req, res, next) => {
  const userId = req.user.id;

  let filter = { userId };

  Bride.find(filter)
    .sort('weddingDate')
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      next(err);
    });
});

router.get('/brides/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('The `id` is not valid');
    err.status = 400;
    return next(err);
  }

  Bride.findOne({ _id: id, userId })
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

router.post('/brides', bodyParser.json(), (req, res, next) => {
  const {
    firstName,
    lastName,
    phone,
    email,
    weddingDate,
    location,
    notes
  } = req.body;
  const userId = req.user.id;
  const newBride = {
    firstName,
    lastName,
    phone,
    email,
    weddingDate,
    location,
    userId,
    notes
  };

  Bride.create(newBride)
    .then(result => {
      res
        .location(`${req.originalUrl}/${result.id}`)
        .status(201)
        .json(result);
    })
    .then(() =>  newBride)
    .catch(err => {
      console.log(err);
      next(err);
    });
});

router.put('/brides/:id', bodyParser.json(), (req, res, next) => {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    phone,
    email,
    weddingDate,
    location,
    notes
  } = req.body;
  const userId = req.user.id;
  const updateItem = {
    firstName,
    lastName,
    phone,
    email,
    weddingDate,
    location,
    notes
  };
  const options = { new: true };

  Bride.findByIdAndUpdate(id, updateItem, options)
    .then(result => {
      console.log(result);
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => next(err));
});

/* ========== DELETE/REMOVE A SINGLE ITEM ========== */
router.delete('/brides/:id', (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  Bride.findOneAndRemove({ _id: id, userId })
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
