import React from "react";
import SessionForm from "./SessionForm";
import Modal from "../Modal/Modal";

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
                title={"Setkání " + (id?("#"+id):"")}
                size="xl"
            >
                <SessionForm handleSave={onNewSession} id={id} projectId={projectId} clientId={clientId}/>
            </Modal>
        </>
    );
};

export default SessionFormModal;