import React from "react";
import Modal from 'react-modal';
import ReportsSettingsForm from "./ReportsSettingsForm";

Modal.setAppElement("#root");

const ReportsSettingsModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, setSettings, settings }) => {
    function handleSave(settings) {
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
                className="modalccc " /* modal-xl*/
                overlayClassName="modal-dialogccc"
            >
                <div className="modal-content">
                    <div className="modal-body p-0">
                        <div className="card p-3 p-lg-4 d-block">
                            <button onClick={onRequestClose} type="button" className="btn-close float-end"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            <h2 className="mb-4">Nastavení reportu</h2>

                            <ReportsSettingsForm
                                settings={settings}
                                setSettings={setSettings}
                                handleSave={handleSave}/>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default ReportsSettingsModal;