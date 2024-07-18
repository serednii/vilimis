import React from "react";
import ClientForm from "./ClientForm";
import Modal from "../Modal/Modal";

const ClientFormModal = ({ onRequestClose, onAfterOpen, isOpen, callback, id }) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={id ? ("Klient #"+id):"Nový klient"}
                size={id?"xl":"md"}
            >

                <ClientForm handleSave={callback} id={id}/>
            </Modal>
        </>
    );
};

export default ClientFormModal;