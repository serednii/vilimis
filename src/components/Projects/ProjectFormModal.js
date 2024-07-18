import React from "react";
import ProjectForm from "./ProjectForm";
import Modal from "../Modal/Modal";

const ProjectFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, clientId }) => {
    function onNewProject(project) {
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
                title={id ? ("Projekt #"+id):"Nový projekt"}
                size={id ? "xl":"md"}
            >

                <ProjectForm clientId={clientId} handleSave={onNewProject} id={id}/>
            </Modal>
        </>
    );
};

export default ProjectFormModal;