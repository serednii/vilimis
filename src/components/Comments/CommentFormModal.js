import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import Select from "react-select";
import { CONFIG } from "../../config";
import CommentForm from "./CommentForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

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
                            <h2>Poznámka #{id}</h2>

                            <CommentForm handleSave={onNewComment} id={id} entity={entity} entityId={entityId}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default CommentFormModal;