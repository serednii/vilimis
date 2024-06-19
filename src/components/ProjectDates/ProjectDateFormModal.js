import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import Select from "react-select";
import { CONFIG } from "../../config";
import ProjectDateForm from "./ProjectDateForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const ProjectDateFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, projectId }) => {
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
                            <h2>Datum projektu #{id}</h2>

                            <ProjectDateForm handleSave={onNewProjectDate} id={id} projectId={projectId}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ProjectDateFormModal;