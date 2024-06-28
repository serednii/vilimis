import React from "react";
import Modal from 'react-modal';
import ClientContactForm from "./ClientContactForm";

Modal.setAppElement("#root");

const ClientContactFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, clientId }) => {
    function handleSave(task) {
        setIsOpen(false);

        if (callback) {
            callback(task);
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
                            <h2>Klient - kontakt #{id}</h2>

                            <ClientContactForm clientId={clientId} handleSave={handleSave} id={id}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ClientContactFormModal;