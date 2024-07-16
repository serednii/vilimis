import React from "react";
import Modal from "../Modal/Modal";
import ProfilForm from "./ProfilForm";

const ProfilFormModal = ({isOpen, callback, id, entity, entityId}) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                title={"Profil"}
                size="md"
            >
                <ProfilForm handleSave={callback} id={id} entity={entity} entityId={entityId}/>
            </Modal>
        </>
    );
};

export default ProfilFormModal;