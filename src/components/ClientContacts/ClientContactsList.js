import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";

const ClientContactsList = ({}) => {
    const {API} = useRootContext()
    const [clients, setEndConsumers] = useState([]);

    useEffect(() => {
        API.getData("/clientContact/list", (clients) => {
            setEndConsumers(clients);
        });
    }, []);

    function handleDelete(id) {
        API.getData("/clientContact/delete/"+id, ()=>{
            API.getData("/clientContact/list", (clients) => {
                setEndConsumers(clients);
            });
        });
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Klienti - kontakty</h1></div>
            </div>

            <div className="my-3">
                <NavLink to="/client-contacts/new" className="btn btn-primary" type="button">Nový klient - kontakt</NavLink>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0 rounded">
                            <thead className="thead-light">
                            <tr>
                                <th className="border-0 rounded-start">#</th>
                                <th className="border-0">Jméno</th>
                                <th className="border-0">Příjmení</th>
                                <th className="border-0">Telefon</th>
                                <th className="border-0">E-mail</th>
                                <th className="border-0 rounded-end">Akce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {clients && clients.length && clients.map((client, client_key) => (
                                <tr key={client_key}>
                                    <td><NavLink to={"/client-contacts/edit/" + client.id}
                                                 className="text-primary fw-bold">{client.id}</NavLink></td>
                                    <td className="fw-bold ">
                                        {client.name}
                                    </td>
                                    <td className="fw-bold ">
                                        {client.surname}
                                    </td>
                                    <td> {client.phone}</td>
                                    <td> {client.email}</td>
                                    <td>
                                        <NavLink to={"/client-contacts/edit/" + client.id}
                                                 className="btn btn-sm btn-primary" type="button">Upravit</NavLink>
                                        <button
                                            onClick={() => window.confirm("Opravdu smazat?") && handleDelete(client.id)}
                                            className="btn btn-sm btn-danger" type="button">Smazat
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ClientContactsList;