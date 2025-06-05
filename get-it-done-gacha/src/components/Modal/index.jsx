/*CREDIT: https://fireship.io/lessons/framer-motion-modal/ TUTORIAL */

import { motion } from "framer-motion";
import Backdrop from "../Backdrop";
import React from 'react';
const newspaper = {
    hidden: {
      transform: "scale(0) rotate(720deg)",
      opacity: 0,
      transition: {
        delay: 0.3,
      },
    },
    visible: {
      transform: " scale(1) rotate(0deg)",
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
    exit: {
      transform: "scale(0) rotate(-720deg)",
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    // exit: {
    //   y: "100vh",
    //   opacity: 0,
    // },
  };

const Modal = ({ handleClose, item, ret}) => {
  let audio = new Audio("/eggert_voiceline.mp3");
    //TO DO. change className gradient based on rarity
    console.log(item.rarity);
    var bg = (item.rarity == 4)? "modal pink-gradient" : (item.rarity == 5)? "modal gold-gradient" : "modal blue-gradient";
    // if (rarity == 4)
    //   bg = "modal pink-gradient";
    // else
    //   bg = "modal gold-gradient";
    return (
      <Backdrop onClick={handleClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}  
            className={bg}
            variants={newspaper}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h2 style={{marginBottom: 0}}>{item.name}</h2> 
            <img src={item.imagePath} width="300" height="300"/>
            <button style={{'background-color': "#662d2d"}} onClick={handleClose}>{ret}</button>
          </motion.div>
      </Backdrop>
    );
  };


  /* structure of an item:
const exampleItem = {
    name: "",
    description: "",
    imagePath (path starting not include "public"): "" 
};
*/
  
  export default Modal;