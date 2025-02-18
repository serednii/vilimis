import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";

const EndCustomerContactsList = ({}) => {
    const {API} = useRootContext()
    const [endCustomers, setEndConsumers] = useState([]);

    useEffect(() => {
        API.getData("/endCustomerContact/list", (endCustomers) => {
            setEndConsumers(endCustomers);
        });
    }, []);

    function handleDelete(id) {
        API.getData("/endCustomerContact/delete/"+id, ()=>{
            API.getData("/endCustomerContact/list", (endCustomers) => {
                setEndConsumers(endCustomers);
            });
        });
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Koncoví zákazníci - kontakty</h1></div>
            </div>

            <div className="my-3">
                <NavLink to="/end-customer-contacts/new" className="btn btn-primary" type="button">Nový koncový zákazník - kontakt</NavLink>
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
                            {endCustomers && endCustomers.length && endCustomers.map((endCustomer, endCustomer_key) => (
                                <tr key={endCustomer_key}>
                                    <td><NavLink to={"/end-customer-contacts/edit/" + endCustomer.id}
                                                 className="text-primary fw-bold">{endCustomer.id}</NavLink></td>
                                    <td className="fw-bold ">
                                        {endCustomer.name}
                                    </td>
                                    <td className="fw-bold ">
                                        {endCustomer.surname}
                                    </td>
                                    <td> {endCustomer.phone}</td>
                                    <td> {endCustomer.email}</td>
                                    <td>
                                        <NavLink to={"/end-customer-contacts/edit/" + endCustomer.id}
                                                 className="btn btn-sm btn-primary" type="button">Upravit</NavLink>
                                        <button
                                            onClick={() => window.confirm("Opravdu smazat?") && handleDelete(endCustomer.id)}
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

export default EndCustomerContactsList;