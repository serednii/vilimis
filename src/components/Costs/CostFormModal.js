import React from "react";
import CostForm from "./CostForm";
import Modal from "../Modal/Modal";
import {CurrencyDollar, Users} from "@phosphor-icons/react";

const CostFormModal = ({ onRequestClose, onAfterOpen, isOpen, callback, id }) => {

    return (
        <>
            <Modal
                isOpen={isOpen}
                onAfterOpen={onAfterOpen}
                onRequestClose={onRequestClose}
                title={id ? (<><CurrencyDollar/> Náklad #{id}</>):"Nový náklad"}
                size={id?"xl":"md"}
            >

                <CostForm handleSave={callback} id={id}/>
            </Modal>
        </>
    );
};

export default CostFormModal;