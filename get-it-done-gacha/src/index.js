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

// Add middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Ensure status column exists
connection.query(
  "SHOW COLUMNS FROM `gacha-db`.`users` LIKE 'status'",
  (error, results) => {
    if (error) {
      console.error('Error checking status column:', error);
      return;
    }
    
    if (results.length === 0) {
      console.log('Status column does not exist, creating it...');
      connection.query(
        "ALTER TABLE `gacha-db`.`users` ADD COLUMN status TEXT",
        (error) => {
          if (error) {
            console.error('Error creating status column:', error);
            return;
          }
          console.log('Status column created successfully');
        }
      );
    } else {
      console.log('Status column already exists');
    }
  }
);

app.get('/', (req,res) => res.send('Try: /status, /warehouses, or /warehouses/2') );

app.get('/status', (req, res) => res.send('Success.') );

app.get('/getUserStatus', (req, res) => {
  const username = req.query.username;
  console.log('[DEBUG] GET /getUserStatus - Username:', username);

  if (!username) {
    console.log('[DEBUG] GET /getUserStatus - No username provided');
    return res.status(400).json({ error: 'Username is required' });
  }

  const query = "SELECT status FROM `gacha-db`.`users` WHERE username = ?";
  console.log('[DEBUG] GET /getUserStatus - Executing query:', query);

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('[DEBUG] GET /getUserStatus - Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('[DEBUG] GET /getUserStatus - Query results:', results);

    if (results.length > 0) {
      const status = results[0].status;
      console.log('[DEBUG] GET /getUserStatus - Found status:', status);
      return res.json({ status: status || '' });
    }

    console.log('[DEBUG] GET /getUserStatus - User not found');
    return res.status(404).json({ error: 'User not found' });
  });
});

app.post('/updateStatus', (req, res) => {
  console.log('[DEBUG] POST /updateStatus - Request body:', req.body);
  const { username, status } = req.body;

  if (!username || status === undefined) {
    console.log('[DEBUG] POST /updateStatus - Missing fields. Username:', username, 'Status:', status);
    return res.status(400).json({ error: 'Username and status are required' });
  }

  const query = "UPDATE `gacha-db`.`users` SET status = ? WHERE username = ?";
  console.log('[DEBUG] POST /updateStatus - Executing query:', query);

  connection.query(query, [status, username], (error, results) => {
    if (error) {
      console.error('[DEBUG] POST /updateStatus - Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    console.log('[DEBUG] POST /updateStatus - Query results:', results);

    if (results.affectedRows === 0) {
      console.log('[DEBUG] POST /updateStatus - No rows updated');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('[DEBUG] POST /updateStatus - Status updated successfully');
    res.json({ message: 'Status updated successfully', status });
  });
});

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

// Add a test endpoint to verify the server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Use port 8080 by default, unless configured differently in Google Cloud
const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`App is running at: http://localhost:${port}`);
});


