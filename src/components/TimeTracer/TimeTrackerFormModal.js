import React from "react";
import Modal from 'react-modal';
import TimeTrackerItem from "./TimeTrackerItem";

Modal.setAppElement("#root");

const TimeTrackerFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, taskTimetrack }) => {
    function onSaveTimetrack() {
        setIsOpen(false);

        if (callback) {
            callback(true);
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
                            <h2>Časový záznam #{taskTimetrack?.id}</h2>

                            <TimeTrackerItem taskTimetrack={taskTimetrack} onChange={onSaveTimetrack}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default TimeTrackerFormModal;