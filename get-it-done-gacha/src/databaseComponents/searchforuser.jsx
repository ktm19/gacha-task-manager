import React, { useState, useEffect } from 'react';
import '../App.css' 
import axios from 'axios';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
axios.defaults.baseURL = 'http://localhost:8080';

function SearchForUser({ username, toDo }) {
  console.log("searchforuser received " + username);
//   const [results, setResults] = useState([]);

  useEffect(() => {
    axios.get("/searchForUser?username=" + username).then((response) => {
        // setResults(response.data);
        toDo(response.data);
    });
  }, []);

//   return (results);
}
export default SearchForUser