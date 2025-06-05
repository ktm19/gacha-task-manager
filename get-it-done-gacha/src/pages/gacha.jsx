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
import axios from 'axios';
import { motion, AnimatePresence } from "framer-motion";
import Modal from '../components/Modal/index';
//import ModalChain from '../components/ModalChain/index';
import {itemList} from '../../itemList';


function Gacha() {
    const open = () => setModalOpen(true);

    const [item, setItem] = useState([]);
    const [pulls, setPulls] = useState(0);
    const [pity, setPity] = useState(0);
    const [returnText, setReturn] = useState("Close");

    const [user, setUser] = useState("");

    const [modalOpen, setModalOpen] = useState(false);
    const close = () => {
        setModalOpen(false);
        if (item.length > 1) {
            setItem(item.slice(1));
            open();
        } else if (item.length == 2)
        {
            setItem(item.slice(1));
            setReturn("Close");
        }
            
    };

    function roll() {
        /** GATCHA RATES:
         *  85%:  3*
         *  13%:  4*
         *  2%    5*
         */
        var rand = Math.random() * 100;
        var pull;
        if (rand < 2 || (pity >= 80 && rand < 5) || pity >= 90) {
            pull = itemList.fiveStars[Math.floor(Math.random() * itemList.fiveStars.length)];
        } else if (rand < 14) {
            pull = itemList.fourStars[Math.floor(Math.random() * itemList.fourStars.length)];
        } else {
            pull = itemList.threeStars[Math.floor(Math.random() * itemList.threeStars.length)];
        }
        return pull;
    }
    function syncDB(user) {
        axios.get("/searchForUser", {
            params: {
                username: user
            }
        }).then((response) => {
            setPulls(response.data.money);
            setPity(response.data.pity);
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data);
            } else if (error.request) {
                alert("No response from server.");
            } else {
                alert("A critical error has occured :(");
                console.log("Axios error:", error.message);
            }
        });
    }
    
    useEffect(() => {
        const username = localStorage.getItem('username');
        if (!username) {
            setUser("");
            return;
        }
        setUser(username);
        syncDB(username);
    }, []);

    function tenPull() {
        if (pulls < 10) {
            alert("Not enough pulls for a x10 pull!");
            return;
        }
        var pullArray = new Array(10);
        pullArray = pullArray.fill(0).map(() => roll());
        if (pity + 10 >= 90 && !pullArray.some(e => e.rarity === 5)) {
            pullArray[0] = itemList.fiveStars[Math.floor(Math.random() * itemList.fiveStars.length)];
        }
        axios.put("/tenPull", {
            username: user,
            itemArray: pullArray
        }).then((response) => {
            setReturn("Continue");
            syncDB(user);

            setItem(pullArray);
            
            if (modalOpen)
                close();
            else
                open();
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data);
            } else if (error.request) {
                alert("Pulling: No response from server.");
            } else {
                alert("Pulling: A critical error has occured :(");
                console.log("Pulling:  Axios error:", error.message);
            }
        });
    }

    function singlePull() {
        if (pulls <= 0) {
            alert("Not enough pulls!");
            return;
        }
        var singleItem = roll();
        setItem([singleItem]);
        if (modalOpen)
            close();
        else
            open();

        axios.put("/pull", {
            username: user,
            item: singleItem
        }).then((response) => {
            syncDB(user);
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data);
            } else if (error.request) {
                alert("Pulling: No response from server.");
            } else {
                alert("Pulling: A critical error has occured :(");
                console.log("Pulling:  Axios error:", error.message);
            }
        });

    }

    return (
        <b>
            <h2  style={{marginTop: "1em"}}>Gacha!</h2>
            <p></p>
            <div><img src="banner.png" width="800" height="auto" border-radius="15px"/></div>
            <p></p>
            <p>Pulls: {pulls}</p>
            <p>Pity: {pity}</p>
            <motion.button onClick={singlePull} style={{margin: '5px', 'background-color': "#662d2d", 'color': "#f5efe0"}}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                x1 Pull</motion.button>
            <motion.button onClick={tenPull} style={{margin: '5px', 'background-color': "#662d2d", 'color': "#f5efe0"}} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                x10 Pull
            </motion.button>

            <AnimatePresence
                // Disable any initial animations on children that
                // are present when the component is first rendered
                initial={false}
                // Only render one component at a time.
                // The exiting component will finish its exit
                // animation before entering component is rendered
                exitBeforeEnter={true}
                // Fires when all exiting nodes have completed animating out
                onExitComplete={() => null}
            >
                {modalOpen && <Modal modalOpen={modalOpen} handleClose={close} item={item[0]} ret={returnText}/>}
            </AnimatePresence>

        </b>
    );
}
//{"Never stop gambling!"}

export default Gacha