import React from "react";
import Modal from "../Modal/Modal";
import TimeTracker from "../TimeTracer/TimeTracker";
import ProjectStatusForm from "./ProjectStatusForm";

const ProjectStatusFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, projectId }) => {

    function onUpdate(project) {
        setIsOpen(false);

        if (callback) {
            callback(project);
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
                <ProjectStatusForm handleSave={onUpdate} id={id}/>
            </Modal>
        </>
    );
};

export default ProjectStatusFormModal;