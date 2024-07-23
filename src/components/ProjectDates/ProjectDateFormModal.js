import React from "react";
import ProjectDateForm from "./ProjectDateForm";
import Modal from "../Modal/Modal";

const ProjectDateFormModal = ({onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, projectId}) => {
    function onNewProjectDate(projectDate) {
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
                title={id ? ("Datum projektu #" + id) : "Nový datum projektu"}
                size="md"
            >
                <ProjectDateForm handleSave={onNewProjectDate} id={id} projectId={projectId}/>
            </Modal>
        </>
    );
};

export default ProjectDateFormModal;