import React from "react";
import Modal from "../Modal/Modal";
import ClientContactForm from "./ClientContactForm";

const ClientContactFormModal = ({ onRequestClose, onAfterOpen, isOpen, setIsOpen, callback, id, clientId }) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={id ? ("Klient - kontakt #{id} #"+id):"Nový klient - kontakt"}
            >
                <ClientContactForm clientId={clientId} handleSave={callback} id={id}/>
            </Modal>
        </>
    );
};

export default ClientContactFormModal;