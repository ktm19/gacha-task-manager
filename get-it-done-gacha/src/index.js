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
//const express = require('express');
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
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173', 'https://gacha-test-297999012574.us-west1.run.app/');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Handle preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

// Ensure shelf table exists
connection.query(
  `CREATE TABLE IF NOT EXISTS \`gacha-db\`.\`shelf\` (
    user_id INT PRIMARY KEY,
    slot1 VARCHAR(255),
    slot2 VARCHAR(255),
    slot3 VARCHAR(255),
    slot4 VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
  (error) => {
    if (error) {
      console.error('Error creating shelf table:', error);
      return;
    }
    // console.log('Shelf table exists or was created successfully');
  }
);

// Ensure user_status column exists
connection.query(
  "SHOW COLUMNS FROM `gacha-db`.`users` LIKE 'user_status'",
  (error, results) => {
    if (error) {
      console.error('Error checking user_status column:', error);
      return;
    }
    
    if (results.length === 0) {
      connection.query(
        "ALTER TABLE `gacha-db`.`users` ADD COLUMN user_status VARCHAR(100)",
        (error) => {
          if (error) {
            console.error('Error creating user_status column:', error);
          }
        }
      );
    }
  }
);

app.get('/', (req,res) => res.send('Try: /status, /warehouses, or /warehouses/2') );

app.get('/status', (req, res) => res.send('Success.') );

// Get user's status
app.get('/getUserStatus', (req, res) => {
  const username = req.query.username;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  connection.query(
    "SELECT user_status FROM `gacha-db`.`users` WHERE username = ?",
    [username],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length > 0) {
        return res.json({ status: results[0].user_status || '' });
      }

      return res.status(404).json({ error: 'User not found' });
    }
  );
});

// Update user's status
app.put('/updateUserStatus', (req, res) => {
  const username = req.query.username;
  const { status } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (status === undefined) {
    return res.status(400).json({ error: 'Status is required' });
  }

  if (status.length > 100) {
    return res.status(400).json({ error: 'Status cannot exceed 100 characters' });
  }

  connection.query(
    "UPDATE `gacha-db`.`users` SET user_status = ? WHERE username = ?",
    [status, username],
    (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({ message: 'Status updated successfully', status });
    }
  );
});

app.route('/tasks/:task_id')
  .get((req, res, next) => {
    connection.query(
      "SELECT * FROM `gacha-db`.`tasks` WHERE id = ?",
      req.params.task_id,
      (error, results, fields) => {
        if(error) throw error;
        res.json(results);
      }
    );
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

// Add a test endpoint to verify the server is running
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Use port 8080 by default, unless configured differently in Google Cloud
const port = process.env.PORT || 8080;
app.listen(port, () => {
   console.log(`App is running at: http://localhost:${port}`);
});


