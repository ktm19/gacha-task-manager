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
import express from "express";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import React from "react";
import { createEngine } from "express-react-views";
//import bcrypt from 'bcrypt'
import connection from "./database.js";

console.log("poggers");
const __filename = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__filename), "..");
console.log(__dirname);
const app = express();
app.use(cors());

app.use(express.json())
app.use(express.urlencoded({extended: true}))


// for static stuff like HTML files
app.use(express.static(join(__dirname, "public")));
console.log(join(__dirname, "public"));

// for JSX
app.set("views", join(__dirname, "get-it-done-gacha/src"));
app.set("view engine", "jsx");
app.engine("jsx", createEngine());

app.get("/", (req, res) => res.send("Try: /status, /users, or /tasks/2"));

app.get("/status", function (req, res, next) {
  res.send("Success.");
});

app.get("/users", (req, res) => {
  //console.log(req.body);
  connection.query(
    "SELECT * FROM `main_db`.`users`",
    (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    },
  );
});

app.get("/searchForFriend", (req, res) => {
  // console.log(req.body);
  const username = req.query.username;
  // const { username } = req.body;
  //find user by username
  const query = "SELECT * FROM users WHERE username = ?";
  connection.query(query, [username], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const user = results[0];
      res.status(200).send(user);
    } else {
      res.status(404).send("User not found :(");
    }
  });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    //NOTE: CURRENTLY NOT HASHING. NEED TO IMPORT BCRYPT
    /*const hashedPassword = await bcrypt.hash(password, 10);*/
    const query =
      "INSERT INTO users (username, password, money, pity) VALUE (?, ?, 0, 0)";
    //TO DO: implement check if username is already taken
    connection.query(query, [username, password], (err, result) => {
      if (err) throw err;
      res.status(201).send("User registered successfully: " + username);
    });
  } catch (error) {
    res.status(500).send("Error registering user");
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  //find user by username
  const query = "SELECT * FROM users WHERE username = ?";
  connection.query(query, [username], async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      //CAN CHANGE BEHAVIOR IF TAKEN
      const user = results[0];
      //to do: implement hash
      /**const ismatch = await bcrypt.compare(password, user.password);
       * if (isMatch)
       */
      if (user.password == password) {
        res.status(200).send("Login successful");
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(404).send("User not found :(");
    }
  });
});

app.get("/sus", (req, res, next) => {
  res.send("ඞ");
});

app.get("/pog", (req, res) => {
  res.sendFile(join(__dirname, "get-it-done-gacha", "public", "pog.html"));
});

app.get("/supersus", (req, res) => {
  res.render("sus", { title: "ඞ" });
});

app.route("/tasks/:task_id").get((req, res, next) => {
  connection.query(
    "SELECT * FROM `main_db`.`tasks` WHERE task_id = ?",
    req.params.task_id,
    (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    },
  );
});

// Use port 8080 by default, unless configured differently in Google Cloud
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`App is running at: http://0.0.0.0:${port}`);
});