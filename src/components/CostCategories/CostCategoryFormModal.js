import React from "react";
import CostCategoryForm from "./CostCategoryForm";
import Modal from "../Modal/Modal";
import {Users} from "@phosphor-icons/react";

const CostCategoryFormModal = ({ onRequestClose, onAfterOpen, isOpen, callback, id }) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={id ? (<><Users/> Klient #{id}</>):"Nový klient"}
                size={id?"xl":"md"}
            >

                <CostCategoryForm handleSave={callback} id={id}/>
            </Modal>
        </>
    );
};

export default CostCategoryFormModal;