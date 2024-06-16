import React from "react";
import {useParams} from "react-router-dom";
import EndCustomerContactForm from "./EndCustomerContactForm";

const EndCustomerContactEdit = ({}) => {
    const {id} = useParams();

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Úprava koncového zákazníka - kontakt #{id}</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <EndCustomerContactForm id={id}/>
                </div>
            </div>
        </>
    );
};

export default EndCustomerContactEdit;