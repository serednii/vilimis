import React from "react";
import ReactModal from 'react-modal';

ReactModal.setAppElement("#root");

const Modal = ({ onRequestClose, onAfterOpen, isOpen, title, children, size }) => {
    return (
        <>
            <ReactModal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                contentLabel={title}
                className={"modal-v " + (size ? "modal-"+size : "")}
                overlayClassName="modal-v-dialog"
            >
                <div className="modal-content">
                    <div className="modal-body p-0">
                        <div className="card d-block">
                            <div className="card-header d-flex align-items-center justify-content-between">
                                <h2 className="h4 mb-0">{title}</h2>
                            <button onClick={onRequestClose} type="button" className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>

                            <div className="card-body overflow-auto">
                                {children}
                            </div>

                        </div>
                    </div>
                </div>
            </ReactModal>
        </>
    );
};

export default Modal;