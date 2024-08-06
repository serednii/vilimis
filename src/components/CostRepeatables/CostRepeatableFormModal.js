import React from "react";
import CostRepeatableForm from "./CostRepeatableForm";
import Modal from "../Modal/Modal";
import {CurrencyDollar, Users} from "@phosphor-icons/react";

const CostRepeatableFormModal = ({ onRequestClose, onAfterOpen, isOpen, callback, id }) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={id ? (<><CurrencyDollar/> Opakovaný náklad #{id}</>):"Nový opakovaný náklad"}
                size={id?"xl":"md"}
            >

                <CostRepeatableForm handleSave={callback} id={id}/>
            </Modal>
        </>
    );
};

export default CostRepeatableFormModal;