import React from "react";
import TaskForm from "./TaskForm";
import Modal from "../Modal/Modal";

const TaskFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id }) => {
    function onNewTask(task) {
        setIsOpen(false);

        if (callback) {
            callback(task);
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={"Úkol #"+id}
                size="xl"
            >
                <TaskForm handleSave={onNewTask} id={id}/>
            </Modal>
        </>
    );
};

export default TaskFormModal;