import dotenv from 'dotenv'

// require('dotenv').config()

import express from 'express'
// const express = require('express');
const app = express();
import bodyParser from 'body-parser'
// const bodyParser = require('body-parser');
import connection from './database.js'
// const connection = require('./database');

app.get('/', (req,res) => res.send('Try: /status, /warehouses, or /warehouses/2') );

app.get('/status', (req, res) => res.send('Success.') );

app.get('/users', (req, res) => {
  connection.query(
    "SELECT * FROM `gacha-db`.`users`",
    (error, results, fields) => {
      if(error) throw error;
      res.json(results);
    }
  );
});

app.route('/tasks/:task_id')
  .get( (req, res, next) => {
    connection.query(
      "SELECT * FROM `gacha-db`.`tasks` WHERE id = ?", req.params.task_id,
      (error, results, fields) => {
        if(error) throw error;
        res.json(results);
      }
    );
  });

// Use port 8080 by default, unless configured differently in Google Cloud
const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`App is running at: http://localhost:${port}`);
});
