import React from "react";
import EndCustomerForm from "./EndCustomerForm";
import Modal from "../Modal/Modal";

const EndCustomerFormModal = ({ onRequestClose, onAfterOpen, isOpen, callback, id, clientId }) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={id ? ("Koncový zákazník #"+id):"Nový koncový zákazník"}
            >
                <EndCustomerForm handleSave={callback} id={id} clientId={clientId}/>
            </Modal>
        </>
    );
};

export default EndCustomerFormModal;