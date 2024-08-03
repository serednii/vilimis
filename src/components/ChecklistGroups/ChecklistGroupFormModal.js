import React from "react";
import ChecklistGroupForm from "./ChecklistGroupForm";
import Modal from "../Modal/Modal";

const ChecklistGroupFormModal = ({onRequestClose, onAfterOpen, isOpen, setModalIsOpen, callback, id, checklistId}) => {

    function onNewChecklistGroup(checklistGroup) {
        setModalIsOpen(false);

        if (callback) {
            callback(checklistGroup);
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
                        Skupina v checklistu #{id}
                    </div>
                ) : "Nová skupina v checklistu"}
                size={"md"}
            >
                <ChecklistGroupForm checklistId={checklistId} handleSave={onNewChecklistGroup} id={id}/>
            </Modal>
        </>
    );
};

export default ChecklistGroupFormModal;