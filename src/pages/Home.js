import React, {useEffect, useState} from "react";
import {useRootContext} from "../contexts/RootContext";
import {CONFIG} from "../config";
import {ENTITY_ACTIONS} from "../reducers/entityReducer";

const Home = ({}) => {
    const {loaderDispatch, toast, API} = useRootContext()
    const [clients, setClients] = useState([]);
    const [endCustomers, setEndCustomers] = useState([]);
    const [endCustomerContacts, setEndCustomerContacts] = useState([]);

    useEffect(() => {
        API.getData("/client/list", (clients) => {
            setClients(clients);
        });
        API.getData("/endCustomer/list", (endCustomers) => {
            setEndCustomers(endCustomers);
        });
        API.getData("/endCustomerContact/list", (endCustomerContacts) => {
            setEndCustomerContacts(endCustomerContacts);
        });
    },[]);

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Nástěnka</h1></div>
            </div>
            <table className={"table table-bordered"}>
                <tbody>
                    {clients && clients.length && clients.map((client, client_key) => (
                        <tr key={client_key}>
                            <td>
                                {client.name}
                            </td>
                            <td>
                                {client.address}
                            </td>
                            <td>
                                <table className={"table table-bordered"}>
                                    <tbody>
                                    {endCustomers && endCustomers.length && endCustomers.map((endCustomer, endCustomer_key) => (
                                        endCustomer.clientId === client.id && (
                                            <tr key={endCustomer_key}>
                                                <td>
                                                    {endCustomer.name}
                                                </td>
                                                <td>
                                                    {endCustomer.address}
                                                </td>
                                                <td>
                                                    <table className={"table table-bordered"}>
                                                        <tbody>
                                                        {endCustomerContacts && endCustomerContacts.length && endCustomerContacts.map((endCustomerContact, endCustomerContact_key) => (
                                                            endCustomer.id === endCustomerContact.endCustomerId && (
                                                                <tr key={endCustomerContact_key}>
                                                                    <td>
                                                                        {endCustomerContact.name}
                                                                    </td>
                                                                    <td>
                                                                        {endCustomerContact.surname}
                                                                    </td>
                                                                    <td>
                                                                        {endCustomerContact.email}
                                                                    </td>
                                                                </tr>
                                                            )
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )
                                    ))}
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
};

export default Home;