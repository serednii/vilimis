import React from "react";
import EndCustomerContactForm from "./EndCustomerContactForm";
import Modal from "../Modal/Modal";

const EndCustomerContactFormModal = ({ onRequestClose, onAfterOpen, isOpen, callback, id, endCustomerId }) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={id ? ("Koncový zákazník - kontakt #{id} #"+id):"Nový koncový zákazník - kontakt"}
            >
                <EndCustomerContactForm endCustomerId={endCustomerId} handleSave={callback} id={id}/>
            </Modal>
        </>
    );
};

export default EndCustomerContactFormModal;