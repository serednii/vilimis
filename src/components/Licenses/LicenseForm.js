import React from "react";
import LicenseFormDefault from "./LicenseFormDefault";


const LicenseForm = ({id, handleSave, clientId, projectId, endCustomerId, beforeLicenseId, afterLicenseId, costId}) => {
    return (
        <LicenseFormDefault
            id={id}
            clientId={clientId}
            projectId={projectId}
            endCustomerId={endCustomerId}
            beforeLicenseId={beforeLicenseId}
            afterLicenseId={afterLicenseId}
            costId={costId}
            handleSave={handleSave}
        />
    );
};

export default LicenseForm;