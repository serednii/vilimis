import React from "react";
import ProjectForm from "./ProjectForm";
import Modal from "../Modal/Modal";

const ProjectFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id }) => {
    function onNewProject(project) {
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
                title={id ? ("Projekt #"+id):"Nový projekt"}
                size="xl"
            >

                <ProjectForm handleSave={onNewProject} id={id}/>
            </Modal>
        </>
    );
};

export default ProjectFormModal;