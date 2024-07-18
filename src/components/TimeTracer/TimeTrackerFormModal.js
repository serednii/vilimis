import React from "react";
import TimeTrackerItem from "./TimeTrackerItem";
import Modal from "../Modal/Modal";
import TaskForm from "../Tasks/TaskForm";


const TimeTrackerFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, taskTimetrack }) => {
    function onSaveTimetrack() {
        setIsOpen(false);

        if (callback) {
            callback(true);
        }
    }

    return (
        <>

            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={"Časový záznam " + (taskTimetrack?.id?("#"+taskTimetrack?.id):"")}
                size="sm"
            >
                <TimeTrackerItem taskTimetrack={taskTimetrack} onChange={onSaveTimetrack}/>
            </Modal>
        </>
    );
};

export default TimeTrackerFormModal;