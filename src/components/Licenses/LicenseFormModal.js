import React from "react";
import LicenseForm from "./LicenseForm";
import Modal from "../Modal/Modal";
import {Barcode, CurrencyDollar, Users} from "@phosphor-icons/react";

const LicenseFormModal = ({
                              onRequestClose,
                              onAfterOpen,
                              isOpen,
                              callback,
                              id,
                              projectId,
                              endCustomerId,
                              clientId,
                              afterLicenseId,
                              beforeLicenseId
                          }) => {

    return (<>
        <Modal
            isOpen={isOpen}
            onAfterOpen={onAfterOpen}
            onRequestClose={onRequestClose}
            title={<><Barcode/>&nbsp;{id ? ("Licence #" + id) : "Nová licence"}</>}
            size={id ? "lg" : "lg"}
        >

            <LicenseForm handleSave={callback}
                         id={id}
                         projectId={projectId}
                         endCustomerId={endCustomerId}
                         clientId={clientId}
                         afterLicenseId={afterLicenseId}
                         beforeLicenseId={beforeLicenseId}
            />
        </Modal>
    </>);
};

export default LicenseFormModal;