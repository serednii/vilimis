import React from "react";
import Modal from "../Modal/Modal";
import TimeTracker from "../TimeTracer/TimeTracker";
import TaskStatusForm from "./TaskStatusForm";

const TaskStatusFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, projectId }) => {

    function onUpdate(task) {
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
                        Stav úkolu #{id}
                    </div>
                ):"Nový stav úkolu"}
                size="sm"
            >
                <TaskStatusForm handleSave={onUpdate} id={id}/>
            </Modal>
        </>
    );
};

export default TaskStatusFormModal;