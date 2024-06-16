import React from "react";
import {useNavigate} from "react-router-dom";
import EndCustomerForm from "./EndCustomerForm";

const EndCustomerNew = ({}) => {
    const navigate = useNavigate();

    function handleSave(endCustomer) {
        if (endCustomer && "id" in endCustomer) {
            const id = endCustomer.id;
            navigate("/end-customers/edit/" + id);
        }
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nový koncový zákazník</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <EndCustomerForm handleSave={handleSave}/>
                </div>
            </div>
        </>
    );
};

export default EndCustomerNew;