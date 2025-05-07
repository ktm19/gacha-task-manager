import express from 'express'
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

