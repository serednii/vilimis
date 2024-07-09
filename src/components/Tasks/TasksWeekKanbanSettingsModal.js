import React from "react";
import TasksWeekKanbanSettingsForm from "./TasksWeekKanbanSettingsForm";
import Modal from "../Modal/Modal";


const TasksWeekKanbanSettingsModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, taskStatuses, setSettings, settings }) => {
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
                title="Nastavení výpisu úkolů"
                size="md"
            >
                <TasksWeekKanbanSettingsForm
                    settings={settings}
                    setSettings={setSettings}
                    taskStatuses={taskStatuses}
                    handleSave={handleSave}/>
            </Modal>
        </>
    );
};

export default TasksWeekKanbanSettingsModal;