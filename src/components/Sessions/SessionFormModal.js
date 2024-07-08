import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import Select from "react-select";
import { CONFIG } from "../../config";
import SessionForm from "./SessionForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const SessionFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, projectId, clientId }) => {
    function onNewSession(session) {
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
                            <h2>Setkání #{id}</h2>

                            <SessionForm handleSave={onNewSession} id={id} projectId={projectId} clientId={clientId}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default SessionFormModal;