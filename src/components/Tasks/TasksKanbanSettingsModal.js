import React from "react";
import TaskForm from "./TaskForm";
import Modal from 'react-modal';
import TasksKanbanSettingsForm from "./TasksKanbanSettingsForm";

Modal.setAppElement("#root");

const TasksKanbanSettingsModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, taskStatuses, setSettings, settings }) => {
    function handleSave(settings) {
        setIsOpen(false);

        if (callback) {
            callback();
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                contentLabel="Example Modal"
                className="modalccc  modal-xl"
                overlayClassName="modal-dialogccc"
            >
                <div className="modal-content">
                    <div className="modal-body p-0">
                        <div className="card p-3 p-lg-4 d-block">
                            <button onClick={onRequestClose} type="button" className="btn-close float-end"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            <h2 className="mb-4">Nastavení výpisu úkolů</h2>

                            <TasksKanbanSettingsForm
                                settings={settings}
                                setSettings={setSettings}
                                taskStatuses={taskStatuses}
                                handleSave={handleSave}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TasksKanbanSettingsModal;