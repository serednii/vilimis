import React from "react";
import ClientForm from "./ClientForm";
import Modal from "../Modal/Modal";
import {Users} from "@phosphor-icons/react";

const ClientFormModal = ({ onRequestClose, onAfterOpen, isOpen, callback, id }) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={id ? (<><Users/> Klient #{id}</>):"Nový klient"}
                size={id?"xl":"md"}
            >

                <ClientForm handleSave={callback} id={id}/>
            </Modal>
        </>
    );
};

export default ClientFormModal;