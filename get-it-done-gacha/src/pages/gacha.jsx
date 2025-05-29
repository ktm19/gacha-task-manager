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

axios.defaults.baseURL = 'http://localhost:8080';

function Gacha() {
    const [modalOpen, setModalOpen] = useState(false);
    const close = () => setModalOpen(false);
    const open = () => setModalOpen(true);

    const [item, setItem] = useState("");
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
            pull(() => {});
        else
            alert("Not enough pulls!");
    }

    function tenPull() {
        if (pulls >= 10) {
            pull(pull(pull(pull(pull))));
            //alert("TEN PULL");
            // for (var i = 0; i < 10; i++) {
            //     pull();
            // }
        } else
            alert("Not enough pulls for a x10 pull!");
    }



    function pull(completion) {
        /** GATCHA RATES:
         *  85%:  3*
         *  13%:  4*
         *  2%    5*
         */
        var roll = Math.random() * 100;
        console.log(roll);
        if (roll < 2) {
            //five star
            setItem("5 star");
            console.log("5 star");
        } else if (roll < 15) {
            //four star
            setItem("4 star");
            console.log("4 star");
        } else {
            //three star
            setItem("3 star");
            console.log("3 star");
        }
        //setPulls(pulls => pulls - 1);
        //setPity(pity => pity + 1);
        if (modalOpen)
            close();
        else
            open();

        // axios.put("/updatePity", {
        //     username: user,
        //     pity: pity + 1,
        // }).then((response) => {
        //     console.log("success: " + pity);
        // }).catch((error) => {
        //     if (error.response) {
        //         alert(error.response.data);
        //         console.log(error.response.data);
        //     } else if (error.request) {
        //         alert("No response from server.");
        //         console.log("No response from server.");
        //     } else {
        //         alert("A critical error has occured :(");
        //         console.log("Axios error:", error.message);
        //     }
        // });

        // axios.put("/updatePulls", {
        //     username: user,
        //     pulls: pulls - 1,
        // }).then((response) => {
        //     console.log(pulls);
        // }).catch((error) => {
        //     if (error.response) {
        //         alert(error.response.data);
        //         console.log(error.response.data);
        //     } else if (error.request) {
        //         alert("No response from server.");
        //         console.log("No response from server.");
        //     } else {
        //         alert("A critical error has occured :(");
        //         console.log("Axios error:", error.message);
        //     }
        // });
        
        axios.put("/pull", {
            username: user,
        }).then((response) => {
            if (completion) {
                completion();
            }
            console.log("updating success");
        }).catch((error) => {
            if (error.response) {
                alert(error.response.data);
                console.log(error.response.data);
            } else if (error.request) {
                alert("Pulling: No response from server.");
                console.log("Pulling: No response from server.");
            } else {
                alert("Pulling: A critical error has occured :(");
                console.log("Pulling:  Axios error:", error.message);
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
            <motion.button onClick={singlePull}
                whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                x1 Pull</motion.button>
            <motion.button onClick={tenPull} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
                
                {modalOpen && <Modal modalOpen={modalOpen} handleClose={close} text = {item}/>}
            </AnimatePresence>

        </b>
    );
}
//{"Never stop gambling!"}

export default Gacha