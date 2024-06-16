import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";

const ClientsList = ({}) => {
    const {API} = useRootContext()
    const [clients, setClients] = useState([]);

    useEffect(() => {
        API.getData("/client/list", (clients) => {
            setClients(clients);
        });
    }, []);

    function handleDelete(id) {
        API.getData("/client/delete/"+id, ()=>{
            API.getData("/client/list", (clients) => {
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
        </>
    );
};

export default ClientsList;