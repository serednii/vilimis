import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import BudgetCalculator from "../../utils/BudgetCalculator";
import InvoicesChart from "./InvoicesChart";
import {FilePdf, Pencil, Trash} from "@phosphor-icons/react";
import InvoicesOverview from "./InvoicesOverview";

const InvoicesList = ({}) => {
    const {API} = useRootContext()
    const [invoices, setInvoices] = useState([]);
    const [clients, setClients] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear())
    const actualYear = new Date().getFullYear();
    const years = Array.from({length: 20}, (x, i) => actualYear - i);

    useEffect(() => {
        API.getData("/invoice/list?order=number%20DESC", (invoices) => {
            setInvoices(invoices);
        });

        API.getData("/client/list?order=name", (clients) => {
            setClients(clients);
        });
    }, []);

    function handleDelete(id) {
        API.getData("/invoice/delete/" + id, () => {
            API.getData("/invoice/list?order=number%20DESC", (invoices) => {
                setInvoices(invoices);
            });
        });
    }

    function generatePdf(id) {
        let filename = invoices?.filter(invoice => invoice.id == id)[0].number;
        API.blobData("/invoicePdf/" + id, "Faktura_" + filename + ".pdf");
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Faktury</h1></div>
            </div>

            <div className="my-3">
                <NavLink to="/invoices/new" className="btn btn-primary" type="button">Nová faktura</NavLink>
            </div>

            {invoices && invoices.length > 0 && (
                <>
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <div className="card border-0 shadow h-100">
                                <div className="card-body">
                                    <select className="form-select mb-3" defaultValue={year}
                                            onChange={(e) => setYear(e.target.value)}>
                                        {years.map((y) => (
                                            <option value={y} key={y}>{y}</option>
                                        ))}
                                    </select>

                                    <InvoicesOverview invoices={invoices} year={year}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-8 mb-4">
                            <div className="card border-0 shadow h-100">
                                <div className="card-body">
                                <InvoicesChart invoices={invoices} year={year}/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card border-0 shadow mb-4">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-centered table-nowrap mb-0 rounded">
                                    <thead className="thead-light">
                                    <tr>
                                        <th className="border-0 rounded-start">#</th>
                                        <th className="border-0">Číslo</th>
                                        <th className="border-0">Klient</th>
                                        <th className="border-0">Datum splatnost</th>
                                        <th className="border-0">Částka</th>
                                        <th className="border-0">Zaplaceno</th>
                                        <th className="border-0 rounded-end">Akce</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {invoices.map((invoice, invoice_key) => (
                                        <tr key={invoice_key}>
                                            <td><NavLink to={"/invoices/edit/" + invoice.id}
                                                         className="text-primary fw-bold">{invoice.id}</NavLink></td>
                                            <td className="fw-bold ">
                                                {invoice.number}
                                            </td>
                                            <td> {clients?.filter(client => client.id == invoice.clientId)[0]?.name}</td>
                                            <td> {invoice.dueDate.date.substring(0, 10)}</td>
                                            <td className="text-end"> {(new BudgetCalculator)._numberFormat(invoice.amount, 2, ".", " ")} Kč</td>
                                            <td> {invoice.payed ? "ano" : "ne"}</td>
                                            <td>
                                                <button
                                                    onClick={() => generatePdf(invoice.id)}
                                                    className="btn btn-sm btn-secondary" type="button">
                                                    <FilePdf/>
                                                </button>
                                                &nbsp;
                                                <NavLink to={"/invoices/edit/" + invoice.id}
                                                         className="btn btn-sm btn-primary" type="button">
                                                    <Pencil/>
                                                </NavLink>
                                                &nbsp;
                                                <button
                                                    onClick={() => window.confirm("Opravdu smazat?") && handleDelete(invoice.id)}
                                                    className="btn btn-sm btn-danger" type="button">
                                                    <Trash/>
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
            )}
        </>
    );
};

export default InvoicesList;