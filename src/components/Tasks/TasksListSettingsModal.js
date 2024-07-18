import React from "react";
import TasksKanbanSettingsForm from "./TasksKanbanSettingsForm";
import Modal from "../Modal/Modal";
import TasksListSettingsForm from "./TasksListSettingsForm";


const TasksListSettingsModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, taskStatuses, setSettings, settings }) => {
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
                title={"Nastavení výpisu úkolů"}
                size={"md"}
            >
                <TasksListSettingsForm
                    settings={settings}
                    setSettings={setSettings}
                    taskStatuses={taskStatuses}
                    handleSave={handleSave}/>
            </Modal>
        </>
    );
};

export default TasksListSettingsModal;