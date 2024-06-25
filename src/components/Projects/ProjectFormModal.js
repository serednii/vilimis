import React from "react";
import ProjectForm from "./ProjectForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

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
                            <h2>Projekt #{id}</h2>

                            <ProjectForm handleSave={onNewProject} id={id}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProjectFormModal;