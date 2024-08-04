import React from "react";
import ChecklistItemForm from "./ChecklistItemForm";
import Modal from "../Modal/Modal";

const ChecklistItemFormModal = ({onRequestClose, onAfterOpen, isOpen, setModalIsOpen, callback, id, checklistId, checklistGroupId}) => {

    function onNewChecklistItem() {
        setModalIsOpen(false);

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
                title={id ? (
                    <div className="d-flex">
                        Položka v checklistu #{id}
                    </div>
                ) : "Nová položka v checklistu"}
                size={"md"}
            >
                <ChecklistItemForm checklistId={checklistId} checklistGroupId={checklistGroupId} handleSave={onNewChecklistItem} id={id}/>
            </Modal>
        </>
    );
};

export default ChecklistItemFormModal;