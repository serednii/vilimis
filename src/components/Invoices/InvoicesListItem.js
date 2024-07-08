import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import {NavLink} from "react-router-dom";
import InvoiceFormModal from "../Invoices/InvoiceFormModal";

const InvoicesListItem = ({onUpdate, invoice, projects, endCustomers, clients}) => {
    let dateP1 = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    let dateP2 = new Date((new Date()).getTime() + 2 * 24 * 60 * 60 * 1000);
    let dateP7 = new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000);
    let dateP31 = new Date((new Date()).getTime() + 31 * 24 * 60 * 60 * 1000);
    let isImg = false;

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalInvoiceId, setModalInvoiceId] = React.useState(0);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <>
            <div role="presentation" onClick={() => {
                setModalInvoiceId(invoice.id);
                setIsOpen(true)
            }} className="row ps-lg-1" style={{cursor: "pointer"}}>
                <div className="col-auto">
                    <div className="icon-shape icon-xs icon-shape-primary rounded p-1"
                         style={{width: "5rem"}}>
                        {isImg = false}
                        {"projectId" in invoice && invoice.projectId && projects.filter(project => project.id === invoice.projectId).map((project, project_index) => (
                            <React.Fragment key={project_index}>

                                {"endCustomerId" in project && project.endCustomerId && endCustomers.filter(endCustomer => endCustomer.id === project.endCustomerId).map((endCustomer, endCustomer_index) => (
                                    endCustomer.logo && (
                                        <React.Fragment key={endCustomer_index}>
                                            <img src={CONFIG.uploadDir + endCustomer.logo}/>
                                            {isImg = true}
                                        </React.Fragment>
                                    )
                                ))}
                                {!isImg && "clientId" in project && project.clientId && clients.filter(client => client.id === project.clientId).map((client, client_index) => (
                                    <React.Fragment key={client_index}>
                                        <img src={CONFIG.uploadDir + client.logo}/>
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="col ms-n2">
                    <h3 className="fs-6 fw-bold mb-1">{invoice.name}</h3>
                    <p className="mb-0">
                        {"projectId" in invoice && invoice.projectId && projects.filter(project => project.id === invoice.projectId).map((project, project_index) => (
                            <React.Fragment key={project_index}>
                                {project.name}
                                {"clientId" in project && project.clientId && clients.filter(client => client.id === project.clientId).map((client, client_index) => (
                                    <React.Fragment key={client_index}>
                                        &nbsp;/ {client.name}
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </p>
                    {"deadLineDate" in invoice && invoice.deadLineDate && "date" in invoice.deadLineDate && (
                        <>
                            <div className="d-flex align-items-center">
                                <svg className="icon icon-xxs text-gray-400 me-1"
                                     fill="currentColor"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                          clipRule="evenodd"></path>
                                </svg>
                                <span className="small">
                                                            {dateP1 > (new Date(invoice.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do 24 hodin - </span>
                                                            ) : dateP2 > (new Date(invoice.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do 2 dní - </span>
                                                            ) : dateP7 > (new Date(invoice.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do týdne - </span>
                                                            ) : dateP31 > (new Date(invoice.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do měsíce - </span>
                                                            ) : ""}
                                    {(new Date(invoice.deadLineDate.date)).toLocaleString()}
                                            </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {modalIsOpen && (
                <InvoiceFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={onUpdate}
                    id={modalInvoiceId}/>
            )}
        </>
    );

};

export default InvoicesListItem;