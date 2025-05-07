import express from 'express'
//import bcrypt from 'bcrypt'
const app = express();
import connection from './database.js'

app.get('/', (req,res) => res.send('Try: /status, /users, or /tasks/2') );

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


app.post('/register', async (req, res) => {
	const {username, password} = req.body;
	try {
		//NOTE: CURRENTLY NOT HASHING. NEED TO IMPORT BCRYPT
		/*const hashedPassword = await bcrypt.hash(password, 10);*/
		const query = 'INSERT INTO users (username, password, money, pity) VALUE (?, ?, 0, 0)';
		//TO DO: implement check if username is already taken
		connection.query(query, [username, password], (err,result) => {if (err) throw err;
			res.status(201).send('User registered successfully: ' + username);
		});
	} catch (error) {
		res.status(500).send('Error registering user');
	}
});

app.post('/login', (req,res) => { 
	const {username, password} = req.body;

	//find user by username
	const query = 'SELECT * FROM users WHERE username = ?';
	connection.query(query, [username], async(err, result) => {
		if (err) throw err;
		if (results.length > 0) { //CAN CHANGE BEHAVIOR IF TAKEN
			const user = results[0];
			//to do: implement hash
			/**const ismatch = await bcrypt.compare(password, user.password);
			 * if (isMatch)
			 */
			if (user.password == password) {
				res.status(200).send('Login successful');
			} else {
				res.status(401).send('Invalid credentials');
			}
		} else {
			res.status(404).send('User not found :(');
		}
	});
});



app.get('/sus', (req, res) => {
	res.send('ඞ')
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
app.listen(port, '0.0.0.0', () => {
   	console.log(`App is running at: http://0.0.0.0:${port}`);
});

