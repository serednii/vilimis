import React from "react";
import ChecklistForm from "./ChecklistForm";
import Modal from "../Modal/Modal";

const ChecklistFormModal = ({onRequestClose, onAfterOpen, isOpen, setModalIsOpen, callback, id, taskId, projectId}) => {

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
                title={id ? (
                    <div className="d-flex">
                        Checklist #{id}
                    </div>
                ) : "Nový checklist"}
                size={id ? "xl" : "md"}
            >
                <ChecklistForm taskId={taskId} projectId={projectId} handleSave={onNewChecklist} id={id}/>
            </Modal>
        </>
    );
};

export default ChecklistFormModal;