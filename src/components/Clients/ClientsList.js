import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import {CONFIG} from "../../config";

const ClientsList = ({}) => {
    const {API} = useRootContext()
    const [clients, setClients] = useState([])
    const [clientContacts, setClientContacts] = useState([]);

    useEffect(() => {
        API.getData("/client/list?order=name", (clients) => {
            setClients(clients);
        });
        API.getData("/clientContact/list", (clientContacts) => {
            setClientContacts(clientContacts);
        });
    }, []);

    function handleDelete(id) {
        API.getData("/client/delete/"+id, ()=>{
            API.getData("/client/list?order=name", (clients) => {
                setClients(clients);
            });
        });
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Klienti</h1></div>
            </div>

            <div className="my-3">
                <NavLink to="/clients/new" className="btn btn-primary" type="button">Nový klient</NavLink>
            </div>
            {clients && clients.length && clients.map((client) => (
                <div className="card border-0 shadow mb-4" key={client.id}>
                    <div className="card-body">
                        <div className="float-end text-end">

                            <div className="mb-3">
                            <NavLink to={"/clients/edit/"+client.id} className="btn btn-sm btn-primary" type="button">Upravit</NavLink>

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
                                        <td>
                                            {clientContact.photo && clientContact.photo.length > 0 && (
                                                <img src={CONFIG.uploadDir + clientContact.photo}
                                                     style={{maxWidth: "40px"}}/>
                                            )}
                                        </td>
                                        <td>{clientContact.name} {clientContact.surname}</td>
                                        <td>{clientContact.position}</td>
                                        <td>{clientContact.email}</td>
                                        <td>{clientContact.phone}</td>
                                        <td>

                                            <NavLink to={"/client-contacts/edit/"+clientContact.id} className="btn btn-sm btn-primary" type="button">Upravit</NavLink>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
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
        </>
    );
};

export default ClientsList;