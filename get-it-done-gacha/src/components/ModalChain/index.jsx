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
            duration: 0.3,
        },
    },
};

const ModalChain = ({ handleClose, pullArray }) => {
    const [iterator, setIterator] = setState(0);
    function displayNext() {
        if (iterator == 9) {
            handleClose();
        } else
            setIterator(iterator+1);
    }

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
                <p>{pullArray[iterator]}</p>
                <button onClick={displayNext}>Continue</button>
            </motion.div>
        </Backdrop>
    );
}
export default ModalChain;