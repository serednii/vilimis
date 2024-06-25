import React from "react";
import Modal from 'react-modal';
import EntityForm from "./EntityForm";


Modal.setAppElement("#root");

const EntityEditFormModal = ({ setModalIsOpen, id, onRequestClose }) => {

    return (
        <>
            <Modal
                isOpen={true}
                // onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                contentLabel="Example Modal"
                className="modalccc  modal-xl"
                overlayClassName="modal-dialogccc"
            >
                <div> OPen Modal</div>
                <div className="modal-content">
                    <div className="modal-body p-0">
                        <div className="card p-3 p-lg-4 d-block">
                            <button onClick={onRequestClose} type="button" className="btn-close float-end"
                                data-bs-dismiss="modal"
                                aria-label="Close"></button>
                            <h2>Úkol #{id}</h2>
                            <EntityForm />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EntityEditFormModal;