import React from "react";
import Modal from "../Modal/Modal";
import ChecklistClone from "./ChecklistClone";

const ChecklistCloneModal = ({onRequestClose, onAfterOpen, isOpen, setModalIsOpen, callback, taskId, projectId}) => {

    function onNewChecklist(checklist) {
        setModalIsOpen(false);

        if (callback) {
            callback(checklist);
        }
    }

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={"Klonovat checklist"}
                size={"md"}
            >
                <ChecklistClone taskId={taskId} projectId={projectId} handleSave={onNewChecklist}/>
            </Modal>
        </>
    );
};

export default ChecklistCloneModal;