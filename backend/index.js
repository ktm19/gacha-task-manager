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
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { createEngine } from "express-react-views";
import bcrypt from 'bcrypt'
import connection from "./database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(dirname(__filename), "..");
// console.log(__dirname);
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: "poggers",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      secure: false,               // set to true with HTTPS
      sameSite: 'lax',             // set to 'none' for cross-site cookies with HTTPS
    }
  })
)

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(join(__dirname, "public"))); // For static stuff like HTML files
console.log(join(__dirname, "public"));

// For JSX
app.set("views", join(__dirname, "get-it-done-gacha/src"));
app.set("view engine", "jsx");
app.engine("jsx", createEngine());

app.get("/", (req, res) => res.send("Try: /status, /users, or /tasks/2"));

app.get("/status", function (req, res, next) { res.send("Success."); });

app.get("/users", (req, res) => {
  connection.query(
    "SELECT * FROM `main_db`.`users`",
    (error, results, fields) => {
      if (error) throw error;
      res.json(results);
    },
  );
});


app.get("/searchForUser", async (req, res) => {
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
      res.status(404).send("User not found :(: " + username);
    }
  });
});

app.put("/pull", async (req, res) => {
  const username = req.body.username;
  const item = req.body.item;
  var sql = "UPDATE users SET pity = pity + 1, money = money - 1 WHERE username = '" + username + "'";
  //console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log("updated pity + pulls");
    //return res.status(200).send("Pity Update successful.");
  });
  console.log("adding to db");
  "INSERT INTO users (username, password, money, pity) VALUES (?, ?, 0, 0)";
  var inventoryQuery = "INSERT INTO inventory (username, item_name, img_path, item_rarity, item_copies) VALUES ('" + username + "', '" + item.name + "', '" + item.imagePath + "', " + item.rarity + ", 1) ON DUPLICATE KEY UPDATE item_copies = item_copies + 1";
  console.log(inventoryQuery);
  connection.query(inventoryQuery, function(err, result) {
    if (err) throw err;
    console.log("updated inventory x1");
    return res.status(200).send("Inventory Update successful.");
  });

}); 

app.put("/tenPull", async(req,res) => {
  const username = req.body.username;
  var sql = "UPDATE users SET pity = pity + 10, money = money - 10 WHERE username = '" + username + "'";
  //console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log("updated pity + pulls");
    return res.status(200).send("Pity Update successful.");
  });
})

app.put("/resetPity", async(req,res) => {
  const username = req.body.username;
  var sql = "UPDATE users SET pity = 0 WHERE username = '" + username + "'";
  //console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) throw err;
    console.log("Reset pity");
    return res.status(200).send("Pity Update successful.");
  });
})

app.post("/register", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check for invalid username or password
  if (!username || !password) { return res.status(400).send("Username and password are required."); }
  if (username.length > 12) { return res.status(400).send("Username cannot exceed 12 characters."); }
  if (password.length > 20) { return res.status(400).send("Password cannot exceed 20 characters."); }

  try {
    // Check if username already exists
    const checkQuery = "SELECT * FROM users WHERE username = ?";
    connection.query(checkQuery, [username], async (err, result) => {
      if (err) { console.error(err); return res.status(500).send("Error checking username."); }
      if (result.length > 0) { return res.status(409).send("Username already taken."); }

      const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
      // Insert new user
      const insertQuery = "INSERT INTO users (username, password, money, pity) VALUES (?, ?, 0, 0)";
      connection.query(insertQuery, [username, hashedPassword], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error registering user.");
        }
        return res.status(200).send("User registered successfully: " + username);
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});

app.get("/login", async (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false});
  }
})

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check for invalid username or password
  if (!username || !password) { return res.status(400).send("Username and password are required."); }
  if (username.length > 12) { return res.status(400).send("Username cannot exceed 12 characters."); }
  if (password.length > 20) { return res.status(400).send("Password cannot exceed 20 characters."); }

  try {
    const query = "SELECT * FROM users WHERE username = ?";
    connection.query(query, [username], async (err, result) => {
      if (err) { console.error(err); return res.status(500).send("Error logging in."); }
      if (result.length === 0) { return res.status(401).send("Invalid username or password."); }

      const user = result[0];

      // Compare hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) { return res.status(401).send("Invalid username or password."); }

      req.session.user = user;
      return res.status(200).send(req.session.user);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});

app.get("/searchForUser", (req, res) => { //find user by username
  const username = req.query.username;
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

app.get("/getFriends", (req, res) => { //find friends of given username
  const username = req.query.username;
  const query = "SELECT * FROM friends WHERE username = ?";
  connection.query(query, [username], async (err, results) => {
    if (err) throw err;
    res.status(200).send(results);
  });
});


app.post("/addFriend", async (req, res) => {
  const username = req.body.username;
  const friend_name = req.body.friend_name;

  try {
    // TODO: do some error checking here

    const insertQuery = "INSERT INTO friends (username, user_id, name, friend_id) VALUES (?, 0, ?, 0)";
    connection.query(insertQuery, [username, friend_name], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error adding friend.");
      }
    });
    connection.query(insertQuery, [friend_name, username], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error adding friend.");
      }
      return res.status(200).send("Friend added successfully: " + friend_name);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});


app.post("/removeFriend", async (req, res) => {
  const username = req.body.username;
  const friend_name = req.body.friend_name;

  try {
    // TODO: do some error checking here

    const removeQuery = "DELETE FROM friends WHERE username = ? AND name = ?;"
    connection.query(removeQuery, [username, friend_name], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error removing friend.");
      }
    });
    connection.query(removeQuery, [friend_name, username], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error removing friend.");
      }
      return res.status(200).send("Friend removed successfully: " + friend_name);
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});


app.get("/sus", (req, res, next) => { res.send("ඞ"); });

app.get("/pog", (req, res) => { res.sendFile(join(__dirname, "get-it-done-gacha", "public", "pog.html")); });

app.get("/supersus", (req, res) => { res.render("sus", { title: "ඞ" }); });

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




