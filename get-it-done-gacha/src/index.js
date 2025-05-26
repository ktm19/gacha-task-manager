/* ==========================================================

File Description: 

This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.

========================================================== */

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


