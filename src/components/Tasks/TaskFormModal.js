import React from "react";
import TaskForm from "./TaskForm";
import Modal from "../Modal/Modal";
import TimeTracker from "../TimeTracer/TimeTracker";

const TaskFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, projectId }) => {

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
                title={id ? (
                    <div className="d-flex">
                        <TimeTracker taskId={id}/>
                        Úkol #{id}
                    </div>
                ):"Nový úkol"}
                size="xl"
            >
                <TaskForm projectId={projectId} handleSave={onNewTask} id={id}/>
            </Modal>
        </>
    );
};

export default TaskFormModal;