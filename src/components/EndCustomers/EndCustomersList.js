import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import {CONFIG} from "../../config";
import {NotePencil, Plus, Trash} from "@phosphor-icons/react";
import EndCustomerFormModal from "./EndCustomerFormModal";
import EndCustomerContactForm from "../EndCustomerContacts/EndCustomerContactForm";
import EndCustomerContactFormModal from "../EndCustomerContacts/EndCustomerContactFormModal";

const EndCustomersList = ({}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true)
    const [endCustomers, setEndCustomers] = useState([])
    const [endCustomerContacts, setEndCustomerContacts] = useState([]);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsContactOpen, setIsContactOpen] = React.useState(false);
    const [modalEndCustomerId, setModalEndCustomerId] = React.useState(0);
    const [modalEndCustomerContactId, setModalEndCustomerContactId] = React.useState(0);

    useEffect(() => {
        if (!reload) return;

        API.getData("/endCustomer/list?order=name", (endCustomers) => {
            setEndCustomers(endCustomers);
        });
        API.getData("/endCustomerContact/list", (endCustomerContacts) => {
            setEndCustomerContacts(endCustomerContacts);
        });

        setReload(false);
    }, [reload]);

    function handleDeleteContact(id) {
        API.getData("/endCustomerContact/delete/"+id, ()=>{
            API.getData("/endCustomerContact/list", (endCustomerContacts) => {
                setEndCustomerContacts(endCustomerContacts);
            });
        });
    }

    function closeModal() {
        setIsOpen(false);
    }

    function closeContactModal() {
        setIsContactOpen(false);
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Koncový zákazníci</h1></div>
            </div>

            <div className="my-3">
                <button  onClick={() => {
                    setModalEndCustomerId(null);
                    setIsOpen(true)
                }}
                         className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={12} className="me-2"/>
                    Nový klient
                </button>
            </div>
            {endCustomers?.length > 0 ? endCustomers.map((endCustomer) => (
                <div className="card border-0 shadow mb-4" key={endCustomer.id}>
                    <div className="card-body">
                        <div className="float-end text-end">

                            <div className="mb-3">

                                <button onClick={() => {
                                    setModalEndCustomerId(endCustomer.id);
                                    setIsOpen(true)
                                }}
                                        className="btn btn-sm fs-6 px-1 py-0">
                                    <NotePencil size={20} color="#999"/>
                                </button>

                            </div>
                            {endCustomer.logo && endCustomer.logo.length > 0 && (
                                <img src={CONFIG.uploadDir + endCustomer.logo}
                                     style={{maxWidth: "200px"}}/>
                            )}
                        </div>

                        <h2 className="h5 mb-3">{endCustomer.name}</h2>

                        <table className="table table-bordered w-auto mb-3">
                            <tbody>
                            <tr>
                                <td>IČ:</td>
                                <td>{endCustomer.ic}</td>
                            </tr>
                            <tr>
                                <td>DIČ:</td>
                                <td>{endCustomer.dic}</td>
                            </tr>
                            <tr>
                                <td>Adresa:</td>
                                <td>{endCustomer.address}</td>
                            </tr>
                            </tbody>
                        </table>

                        <table className="table table-bordered table-centered table-nowrap mb-0">
                            <tbody>
                            {endCustomerContacts?.filter(endCustomerContact => endCustomerContact.endCustomerId == endCustomer.id)?.map(endCustomerContact => (
                                <tr key={endCustomerContact.id}>
                                    <td width={77}>
                                        {endCustomerContact.photo && endCustomerContact.photo.length > 0 && (
                                            <img src={CONFIG.uploadDir + endCustomerContact.photo}
                                                 style={{maxWidth: "40px"}}/>
                                        )}
                                    </td>
                                    <td>{endCustomerContact.name} {endCustomerContact.surname}</td>
                                    <td>{endCustomerContact.position}</td>
                                    <td>{endCustomerContact.email}</td>
                                    <td>{endCustomerContact.phone}</td>
                                    <td width={10}>

                                        <button onClick={() => {
                                            setModalEndCustomerContactId(endCustomerContact.id);
                                            setIsContactOpen(true)
                                        }}
                                                className="btn btn-sm fs-6 px-1 py-0">
                                            <NotePencil size={20} color="#999"/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="mt-3">
                            <button onClick={() => {
                                setModalEndCustomerContactId(null);
                                setModalEndCustomerId(endCustomer.id);
                                setIsContactOpen(true)
                            }} className="btn btn-sm d-inline-flex align-items-center me-2">
                                <Plus size={10} className="me-1"/>Nový kontakt
                            </button>
                        </div>
                    </div>
                </div>
            )) : (
                <p>Zatím žádný</p>
            )}

            {/*
            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0 rounded">
                            <thead className="thead-light">
                            <tr>
                                <th className="border-0 rounded-start">#</th>
                                <th className="border-0">Název</th>
                                <th className="border-0">E-mail</th>
                                <th className="border-0">Telefon</th>
                                <th className="border-0">Adresa</th>
                                <th className="border-0">IČ</th>
                                <th className="border-0">DIČ</th>
                                <th className="border-0 rounded-end">Akce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {endCustomers && endCustomers.length && endCustomers.map((endCustomer, endCustomer_key) => (
                                <tr key={endCustomer_key}>
                                    <td>
                                        <NavLink to={"/endCustomers/edit/"+endCustomer.id} className="text-primary fw-bold">
                                            {endCustomer.id}
                                        </NavLink>
                                    </td>
                                    <td className="fw-bold ">
                                        {endCustomer.name}
                                    </td>
                                    <td> {endCustomer.email}</td>
                                    <td> {endCustomer.phone}</td>
                                    <td> {endCustomer.address}</td>
                                    <td> {endCustomer.ic}</td>
                                    <td> {endCustomer.dic}</td>
                                    <td>
                                        <NavLink to={"/endCustomers/edit/"+endCustomer.id} className="btn btn-sm btn-primary" type="button">Upravit</NavLink>
                                        <button
                                            onClick={()=> window.confirm("Opravdu smazat?") && handleDelete(endCustomer.id)}
                                            className="btn btn-sm btn-danger" type="button">Smazat</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
                    */}


            {modalIsOpen && (
                <EndCustomerFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={()=>setReload(true)}
                    id={modalEndCustomerId}/>
            )}

            {modalIsContactOpen && (
                <EndCustomerContactFormModal
                    isOpen={modalIsContactOpen}
                    onRequestClose={closeContactModal}
                    setIsOpen={setIsContactOpen}
                    callback={()=>setReload(true)}
                    endCustomerId={modalEndCustomerId}
                    id={modalEndCustomerContactId}/>
            )}
        </>
    );
};

export default EndCustomersList;