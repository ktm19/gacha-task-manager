/* ==========================================================

File Description: 

This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT without even the implied warranty of
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
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], //changed at 10:56AM 10/16/2023
  credentials: true,
 /*changed at 10:56AM 10/16/2023
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cookie'],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Set-Cookie'],
  optionsSuccessStatus: 200
  changed at 10:56AM 10/16/2023*/
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
      /* changed at 11:10am 10/16/2023 ts lowkey dont work but keeping it here for reference
      secure: false,                // keep false for local development
      sameSite: 'none',            // required for cross-site cookie access
      httpOnly: true,              // prevents client-side access to cookies
       changed at 11:10am 10/16/2023 */
    },
    proxy: true                    // trust the reverse proxy 
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
      res.status(404).send("User not found: " + username);
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
  var inventoryQuery = "INSERT INTO inventory (username, item_name, img_path, item_rarity, item_copies) VALUES ('" + username + "', '" + item.name + "', '" + item.imagePath + "', " + item.rarity + ", 1) ON DUPLICATE KEY UPDATE item_copies = item_copies + 1";
  console.log(inventoryQuery);
  connection.query(inventoryQuery, function(err, result) {
    if (err) throw err;
    console.log("updated pity, pulls, inventory x1");
    return res.status(200).send("Inventory/Pull Update successful.");
  });

}); 

app.put("/tenPull", async(req,res) => {
  const username = req.body.username;
  const itemArray = req.body.itemArray;
  console.log(itemArray);
  var sql = "UPDATE users SET pity = pity + 10, money = money - 10 WHERE username = '" + username + "'";
  //console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) throw err;
    var inventoryQuery = "INSERT INTO inventory (username, item_name, img_path, item_rarity, item_copies) VALUES ";
    for (let item of itemArray) {
      inventoryQuery += "('" + username + "', '" + item.name + "', '" + item.imagePath + "', " + item.rarity + ", 1), ";
    }
    inventoryQuery = inventoryQuery.slice(0,-2) + " ON DUPLICATE KEY UPDATE item_copies = item_copies + 1";
    console.log(inventoryQuery);
    console.log("updated pity + pulls");
    connection.query(inventoryQuery, function(err, result) {
      if (err) throw err;
      console.log("updated pity, pulls, inventory x10");
      return res.status(200).send("Inventory/Pull Update successful.");
    });
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

app.get("/getFriends", (req, res) => { //find friends of given username
  const username = req.query.username;
  const query = "SELECT * FROM friends WHERE username = ?";
  connection.query(query, [username], async (err, results) => {
    if (err) throw err;
    res.status(200).send(results);
  });
});


app.post("/addFriend", (req, res) => {
  const username = req.body.username;
  const friend_name = req.body.friend_name;

  try {
    if (username == friend_name) {
      return res.status(400).send("Cannot add yourself as a friend.");
    }

    const searchQuery = "SELECT * FROM friends WHERE username = ? AND name = ?";
    connection.query(searchQuery, [username, friend_name], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error adding friend.");
      } 
      if (result.length != 0) {
        return res.status(400).send("Already added " + friend_name + " as a friend.");
      }

      const insertQuery = "INSERT INTO friends (username, name) VALUES (?, ?)";
      connection.query(insertQuery, [username, friend_name], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error adding friend.");
        }

        connection.query(insertQuery, [friend_name, username], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error adding friend.");
          }
          return res.status(200).send("Friend added successfully: " + friend_name);
        });
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});


app.post("/removeFriend", (req, res) => {
  const username = req.body.username;
  const friend_name = req.body.friend_name;

  try {
    const searchQuery = "SELECT * FROM friends WHERE username = ? AND name = ?";
    connection.query(searchQuery, [username, friend_name], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error removing friend.");
      } 
      if (result.length == 0) {
        return res.status(400).send("You are not friends with " + friend_name + ".");
      }

      const removeQuery = "DELETE FROM friends WHERE username = ? AND name = ?;"
      connection.query(removeQuery, [username, friend_name], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send("Error removing friend.");
        }

        connection.query(removeQuery, [friend_name, username], (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error removing friend.");
          }
          return res.status(200).send("Friend removed successfully: " + friend_name);
        });
      });
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

/* USER STATUS ENDPOINTS */

app.get("/getUserStatus", async (req, res) => {
  const username = req.query.username;

  if (!username) {
    return res.status(400).send("Username is required.");
  }

  try {
    const query = "SELECT status FROM users WHERE username = ?";
    connection.query(query, [username], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error fetching user status.");
      }
      if (results.length === 0) {
        return res.status(404).send("User not found.");
      }
      res.status(200).json({ status: results[0].status || '' });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});

app.put("/updateUserStatus", async (req, res) => {
  const username = req.query.username;
  const status = req.body.status;

  if (!username) {
    return res.status(400).send("Username is required.");
  }

  try {
    const updateQuery = "UPDATE users SET status = ? WHERE username = ?";
    connection.query(updateQuery, [status, username], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating user status.");
      }
      if (result.affectedRows === 0) {
        return res.status(404).send("User not found.");
      }
      res.status(200).json({ status: status });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});
/* USER STATUS ENDPOINTS */

/* INVENTORY ENDPOINTS */
app.get('/inventory', (req, res) => {
  const username = req.query.username;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // Query inventory directly with username
  connection.query(
    "SELECT item_name, img_path, item_copies FROM `main_db`.`inventory` WHERE username = ?",
    [username],
    (error, inventoryResults) => {
      if (error) {
        console.error('Database error:', error);
        console.error(error.message); // Log the specific error message
        return res.status(500).json({ error: 'Database error' });
      }

      console.log('Query executed for username:', username);
      console.log('Inventory Results:', JSON.stringify(inventoryResults, null, 2));
      res.json(inventoryResults);
    }
  );
});

/* none of the shelf code has been tested yet, so it may not work as expected */

// Get user's shelf layout
app.get('/getShelf', (req, res) => {
  const username = req.query.username;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  // First check if a shelf record exists and get item details in one query
  const query = `
    SELECT s.slot_1, s.slot_2, s.slot_3, s.slot_4,
           i1.img_path as img_1, i2.img_path as img_2, i3.img_path as img_3, i4.img_path as img_4
    FROM (SELECT * FROM \`main_db\`.\`shelf\` WHERE username = ?) s
    LEFT JOIN \`main_db\`.\`inventory\` i1 ON s.slot_1 = i1.item_name AND i1.username = s.username
    LEFT JOIN \`main_db\`.\`inventory\` i2 ON s.slot_2 = i2.item_name AND i2.username = s.username
    LEFT JOIN \`main_db\`.\`inventory\` i3 ON s.slot_3 = i3.item_name AND i3.username = s.username
    LEFT JOIN \`main_db\`.\`inventory\` i4 ON s.slot_4 = i4.item_name AND i4.username = s.username
  `;

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (results.length === 0) {
      // No shelf exists yet, create it with null slots
      connection.query(
        "INSERT INTO `main_db`.`shelf` (username, slot_1, slot_2, slot_3, slot_4) VALUES (?, NULL, NULL, NULL, NULL)",
        [username],
        (error) => {
          if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Database error' });
          }
          // Return empty slots for new shelf
          return res.json({
            slots: [null, null, null, null],
            images: [null, null, null, null]
          });
        }
      );
    } else {
      // Return slots and their corresponding images
      const slots = [
        results[0].slot_1,
        results[0].slot_2,
        results[0].slot_3,
        results[0].slot_4
      ];
      
      const images = [
        results[0].img_1,
        results[0].img_2,
        results[0].img_3,
        results[0].img_4
      ];

      res.json({ slots, images });
    }
  });
});


// Update user's shelf layout
app.put('/updateShelf', (req, res) => {
  const username = req.query.username;
  const { slots } = req.body;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  if (!Array.isArray(slots) || slots.length !== 4) {
    return res.status(400).json({ error: 'Invalid slots format' });
  }

  // First, check if the unique index already exists, if not add it
  connection.query(
    "SHOW INDEXES FROM `main_db`.`shelf` WHERE Key_name = 'username_UNIQUE'",
    (error, results) => {
      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Database error' });
      }

      // If index doesn't exist, create it
      if (results.length === 0) {
        connection.query(
          "ALTER TABLE `main_db`.`shelf` ADD UNIQUE INDEX `username_UNIQUE` (`username`)",
          (error) => {
            if (error) {
              console.error('Database error:', error);
              return res.status(500).json({ error: 'Database error' });
            }
          }
        );
      }

      // Validate that user exists
      connection.query(
        "SELECT username FROM `main_db`.`users` WHERE username = ?",
        [username],
        (error, userResults) => {
          if (error) {
            console.error('Database error:', error);
            return res.status(500).json({ error: 'Database error' });
          }

          if (userResults.length === 0) {
            return res.status(404).json({ error: 'User not found' });
          }

          // Validate that the items being placed exist in the user's inventory
          const nonNullSlots = slots.filter(item => item !== null);
          if (nonNullSlots.length > 0) {
            connection.query(
              "SELECT item_name, img_path FROM `main_db`.`inventory` WHERE username = ? AND item_name IN (?)",
              [username, nonNullSlots],
              (error, inventoryResults) => {
                if (error) {
                  console.error('Database error:', error);
                  return res.status(500).json({ error: 'Database error' });
                }

                const validItems = new Map(inventoryResults.map(row => [row.item_name, row.img_path]));
                const invalidItems = nonNullSlots.filter(item => !validItems.has(item));

                if (invalidItems.length > 0) {
                  return res.status(400).json({ 
                    error: 'Some items are not in your inventory',
                    invalidItems 
                  });
                }

                // First check if user exists in shelf table
                connection.query(
                  "SELECT username FROM `main_db`.`shelf` WHERE username = ?",
                  [username],
                  (error, shelfResults) => {
                    if (error) {
                      console.error('Database error:', error);
                      return res.status(500).json({ error: 'Database error' });
                    }

                    const query = shelfResults.length === 0 
                      ? "INSERT INTO `main_db`.`shelf` (username, slot_1, slot_2, slot_3, slot_4) VALUES (?, ?, ?, ?, ?)"
                      : "UPDATE `main_db`.`shelf` SET slot_1 = ?, slot_2 = ?, slot_3 = ?, slot_4 = ? WHERE username = ?";
                    
                    const params = shelfResults.length === 0
                      ? [username, slots[0], slots[1], slots[2], slots[3]]
                      : [slots[0], slots[1], slots[2], slots[3], username];

                    connection.query(query, params, (error, results) => {
                      if (error) {
                        console.error('Database error:', error);
                        return res.status(500).json({ error: 'Database error' });
                      }

                      // Return both slots and their corresponding images
                      const images = slots.map(slot => slot ? validItems.get(slot) : null);
                      res.json({ 
                        message: 'Shelf updated successfully',
                        slots: slots,
                        images: images
                      });
                    });
                  }
                );
              }
            );
          } else {
            // If all slots are null, check if user exists in shelf table first
            connection.query(
              "SELECT username FROM `main_db`.`shelf` WHERE username = ?",
              [username],
              (error, shelfResults) => {
                if (error) {
                  console.error('Database error:', error);
                  return res.status(500).json({ error: 'Database error' });
                }

                const query = shelfResults.length === 0
                  ? "INSERT INTO `main_db`.`shelf` (username, slot_1, slot_2, slot_3, slot_4) VALUES (?, ?, ?, ?, ?)"
                  : "UPDATE `main_db`.`shelf` SET slot_1 = ?, slot_2 = ?, slot_3 = ?, slot_4 = ? WHERE username = ?";

                const params = shelfResults.length === 0
                  ? [username, slots[0], slots[1], slots[2], slots[3]]
                  : [slots[0], slots[1], slots[2], slots[3], username];

                connection.query(query, params, (error, results) => {
                  if (error) {
                    console.error('Database error:', error);
                    return res.status(500).json({ error: 'Database error' });
                  }
                  res.json({ 
                    message: 'Shelf updated successfully',
                    slots: slots,
                    images: [null, null, null, null]
                  });
                });
              }
            );
          }
        }
      );
    }
  );
});
/* shelf code ends here */
/* INVENTORY ENDPOINTS */

// Use port 8080 by default, unless configured differently in Google Cloud
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log(`App is running at: http://0.0.0.0:${port}`);
});




