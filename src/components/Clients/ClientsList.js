import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import {CONFIG} from "../../config";
import {NotePencil, Plus, Trash} from "@phosphor-icons/react";
import ClientFormModal from "./ClientFormModal";
import ClientContactForm from "../ClientContacts/ClientContactForm";
import ClientContactFormModal from "../ClientContacts/ClientContactFormModal";

const ClientsList = ({}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true)
    const [clients, setClients] = useState([])
    const [clientContacts, setClientContacts] = useState([]);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalIsContactOpen, setIsContactOpen] = React.useState(false);
    const [modalClientId, setModalClientId] = React.useState(0);
    const [modalClientContactId, setModalClientContactId] = React.useState(0);

    useEffect(() => {
        if (!reload) return;

        API.getData("/client/list?order=name", (clients) => {
            setClients(clients);
        });
        API.getData("/clientContact/list", (clientContacts) => {
            setClientContacts(clientContacts);
        });

        setReload(false);
    }, [reload]);

    function handleDeleteContact(id) {
        API.getData("/clientContact/delete/"+id, ()=>{
            API.getData("/clientContact/list", (clientContacts) => {
                setClientContacts(clientContacts);
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
                <div className="mb-3 mb-lg-0"><h1 className="h4">Klienti</h1></div>
            </div>

            <div className="my-3">
                <button  onClick={() => {
                    setModalClientId(null);
                    setIsOpen(true)
                }}
                     className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={12} className="me-2"/>
                    Nový klient
                </button>
            </div>
            {clients && clients.length && clients.map((client) => (
                <div className="card border-0 shadow mb-4" key={client.id}>
                    <div className="card-body">
                        <div className="float-end text-end">

                            <div className="mb-3">

                                <button onClick={() => {
                                    setModalClientId(client.id);
                                    setIsOpen(true)
                                }}
                                      className="btn btn-sm fs-6 px-1 py-0">
                                    <NotePencil size={20} color="#999"/>
                                </button>

                            </div>
                            {client.logo && client.logo.length > 0 && (
                                <img src={CONFIG.uploadDir + client.logo}
                                     style={{maxWidth: "200px"}}/>
                            )}
                        </div>

                        <h2 className="h5 mb-3">{client.name}</h2>

                        <table className="table table-bordered w-auto mb-3">
                            <tbody>
                            <tr>
                                <td>IČ:</td>
                                <td>{client.ic}</td>
                            </tr>
                            <tr>
                                <td>DIČ:</td>
                                <td>{client.dic}</td>
                            </tr>
                            <tr>
                                <td>Adresa:</td>
                                <td>{client.address}</td>
                            </tr>
                            </tbody>
                        </table>

                        <table className="table table-bordered table-centered table-nowrap mb-0">
                            <tbody>
                            {clientContacts?.filter(clientContact => clientContact.clientId == client.id)?.map(clientContact => (
                                <tr key={clientContact.id}>
                                    <td width={77}>
                                        {clientContact.photo && clientContact.photo.length > 0 && (
                                            <img src={CONFIG.uploadDir + clientContact.photo}
                                                 style={{maxWidth: "40px"}}/>
                                        )}
                                    </td>
                                    <td>{clientContact.name} {clientContact.surname}</td>
                                    <td>{clientContact.position}</td>
                                    <td>{clientContact.email}</td>
                                    <td>{clientContact.phone}</td>
                                    <td width={10}>

                                        <button onClick={() => {
                                            setModalClientContactId(clientContact.id);
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
                                setModalClientContactId(null);
                                setModalClientId(client.id);
                                setIsContactOpen(true)
                            }} className="btn btn-sm d-inline-flex align-items-center me-2">
                                <Plus size={10} className="me-1"/>Nový kontakt
                            </button>
                        </div>
                    </div>
                </div>
            ))}

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
                            {clients && clients.length && clients.map((client, client_key) => (
                                <tr key={client_key}>
                                    <td>
                                        <NavLink to={"/clients/edit/"+client.id} className="text-primary fw-bold">
                                            {client.id}
                                        </NavLink>
                                    </td>
                                    <td className="fw-bold ">
                                        {client.name}
                                    </td>
                                    <td> {client.email}</td>
                                    <td> {client.phone}</td>
                                    <td> {client.address}</td>
                                    <td> {client.ic}</td>
                                    <td> {client.dic}</td>
                                    <td>
                                        <NavLink to={"/clients/edit/"+client.id} className="btn btn-sm btn-primary" type="button">Upravit</NavLink>
                                        <button
                                            onClick={()=> window.confirm("Opravdu smazat?") && handleDelete(client.id)}
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
                <ClientFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={()=>setReload(true)}
                    id={modalClientId}/>
            )}

            {modalIsContactOpen && (
                <ClientContactFormModal
                    isOpen={modalIsContactOpen}
                    onRequestClose={closeContactModal}
                    setIsOpen={setIsContactOpen}
                    callback={()=>setReload(true)}
                    clientId={modalClientId}
                    id={modalClientContactId}/>
            )}
        </>
    );
};

export default ClientsList;