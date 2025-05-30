/*CREDIT: https://fireship.io/lessons/framer-motion-modal/ TUTORIAL */

import { motion } from "framer-motion";
import Backdrop from "../Backdrop";

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

const Modal = ({ handleClose, text }) => {
    //TO DO. change className gradient based on rarity
    return (
      <Backdrop onClick={handleClose}>
          <motion.div
            onClick={(e) => e.stopPropagation()}  
            className="modal blue-gradient"
            variants={newspaper}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <p>{text[0]}</p>
            <button onClick={handleClose}>Close</button>
          </motion.div>
      </Backdrop>
    );
  };

  
  export default Modal;