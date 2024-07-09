import React from "react";
import CommentForm from "./CommentForm";
import Modal from "../Modal/Modal";


const CommentFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, entity, entityId }) => {
    function onNewComment(comment) {
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
                title={"Poznámka "+ (id ? "#"+id: "")}
                size="md"
            >
                <CommentForm handleSave={onNewComment} id={id} entity={entity} entityId={entityId}/>
            </Modal>
        </>
    );
};

export default CommentFormModal;