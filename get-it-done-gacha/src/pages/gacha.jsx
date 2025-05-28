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

import React, { useState, useEffect } from 'react';
import '../App.css'
import { Link } from 'react-router-dom';
import axios from 'axios';


axios.defaults.baseURL = 'http://localhost:8080';

function Gacha() {

    const [pulls, setPulls] = useState(180);
    const [pity, setPity] = useState(0);
    const [inventory, updateInventory] = useState([0, 0, 0]);
    var user = "test";

    function syncDB() {
        axios.get("/searchForUser", {
            params: {
                username: user
            }
        }).then((response) => {
            //alert("Login successful! :)")
            console.log(response.data);
            setPulls(response.data.money);
            setPity(response.data.pity);
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data);
                console.log(error.response.data);
            } else if (error.request) {
                alert("No response from server.");
                console.log("No response from server.");
            } else {
                alert("A critical error has occured :(");
                console.log("Axios error:", error.message);
            }
        });
    }
    function singlePull() {
        if (pulls > 0) 
            pull();
        else
            alert("Not enough pulls!");


    }

    function tenPull() {
        if (pulls >= 10) {
            //alert("TEN PULL");
            for (var i = 0; i < 10; i++)
            {
                pull();
            }
                
        } else
            alert("Not enough pulls for a x10 pull!");

    }



    function pull() {
        /** GATCHA RATES:
         *  85%:  3*
         *  13%:  4*
         *  2%    5*
         */
        var roll = Math.random() * 100;
        console.log(roll);
        if (roll < 2) {
            //five star
            console.log("5 star");
        } else if (roll < 15) {
            //four star
            console.log("4 star");
        } else {
            //three star
            console.log("3 star");
        }
        //setPulls(pulls => pulls - 1);
        //setPity(pity => pity + 1);
    
        axios.put("/updatePity", {
                username: user,
                pity: pity + 1,
        }).then((response) => {
            console.log("success: " + pity);
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data);
                console.log(error.response.data);
            } else if (error.request) {
                alert("No response from server.");
                console.log("No response from server.");
            } else {
                alert("A critical error has occured :(");
                console.log("Axios error:", error.message);
            }
        });

        axios.put("/updatePulls", {
            username: user,
            pulls: pulls - 1,
        }).then((response) => {
            console.log(pulls);
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data);
                console.log(error.response.data);
            } else if (error.request) {
                alert("No response from server.");
                console.log("No response from server.");
            } else {
                alert("A critical error has occured :(");
                console.log("Axios error:", error.message);
            }
        });
        syncDB();
        
    }

    useEffect(() => {
        syncDB();
    }, []);
    return (
        <b>I LOVE GAMBLING!!
            <p>Pulls: {pulls}</p>
            <p>Pity: {pity}</p>
            <button onClick={singlePull}>x1 Pull</button>
            <button onClick={tenPull}>x10 Pull</button>
        </b>
    );
}


export default Gacha