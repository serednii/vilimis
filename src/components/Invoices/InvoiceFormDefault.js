import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import ClientsSelectList from "../Clients/ClientsSelectList";
import EndCustomersSelectList from "../EndCustomers/EndCustomersSelectList";
import InvoicesSelectList from "./InvoicesSelectList";
import {CONFIG} from "../../config";
import CypherTextarea from "../../formTypes/CypherTextarea";

const invoiceBlank = {
    number: "",
    url: "",
    parentInvoiceId: null,
    logo: "",
}

const InvoiceFormDefault = ({id, handleSave}) => {
        const {API} = useRootContext()
        const [invoice, setInvoice] = useState(null);
        const [selectedParentInvoiceId, setSelectedParentInvoiceId] = useState(null);
        const [selectedClientId, setSelectedClientId] = useState(null);
        const [selectedEndCustomerId, setSelectedEndCustomerId] = useState(null);

        useEffect(() => {
            if (id) {
                API.getData("/invoice/single/" + id, (data) => {
                    setInvoice(data);
                });
            } else {
                setInvoice(invoiceBlank)
            }
        }, [id]);

        function handleSubmit(event) {
            event.preventDefault();
            event.stopPropagation();

            const formData = new FormData(event.target);

            if (id) {
                formData.append("id", id);
            }

            API.postData("/invoice/save", formData, (data) => {
                setInvoice(data.invoice);

                if (handleSave) {
                    handleSave(data.invoice);
                }
            });
        }

        if (!invoice) {
            return (<>Načítaní..</>)
        }

        return (
            <>
                {invoice && "number" in invoice && (
                    <form onSubmit={handleSubmit}>
                        <input type="hidden" name="amount" value={invoice.amount}/>

                        <div className="row">
                            <div className="col-12 col-md-8">
                                <div className="mb-3">
                                    <label htmlFor="form_edit_name">Číslo faktury</label>
                                    <input defaultValue={invoice.number} type="text" name="number" className="form-control"
                                           id="form_edit_name"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_invoice_type">Typ faktury</label>
                                    <select className="form-control"
                                            name="invoice_type"
                                            id="form_edit_invoice_type"
                                            defaultValue={invoice.invoiceType}>
                                        <option>Faktura</option>
                                        <option>Zálohová faktura</option>
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_variable_symbol">Variabilní symbol</label>
                                    <input defaultValue={invoice.variableSymbol} type="text" name="variable_symbol"
                                           className="form-control"
                                           id="form_edit_variable_symbol"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_editspecific_symbol">Specifický symbol</label>
                                    <input defaultValue={invoice.specificSymbol} type="text" name="specific_symbol"
                                           className="form-control"
                                           id="form_edit_specific_symbol"/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_constant_symbol">Konstatní symbol</label>
                                    <input defaultValue={invoice.constantSymbol} type="text" name="constant_symbol"
                                           className="form-control"
                                           id="form_edit_constant_symbol"/>
                                </div>
                            </div>
                            <div className="col-12 col-md-4">
                                <div className="mb-3">
                                    <label htmlFor="form_edit_client_id">Klient</label>
                                    <ClientsSelectList selected={invoice.clientId}
                                                       onChange={setSelectedClientId}/>
                                    <input type="hidden" name="client_id" value={selectedClientId}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_form_of_payment">Forma úhrady</label>
                                    <select className="form-control"
                                            name="form_of_payment"
                                            id="form_edit_form_of_payment"
                                            defaultValue={invoice.formOfPayment}>
                                        <option>Bankovním převodem</option>
                                        <option>Hotově</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="form_edit_created_date">Datum vystavení</label>
                                    <input defaultValue={invoice.createdDate?.date.substring(0, 10)} type="date"
                                           name="created_date"
                                           className="form-control"
                                           id="form_edit_created_date"></input>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="form_edit_due_date">Datum splatnosti</label>
                                    <input defaultValue={invoice.dueDate?.date.substring(0, 10)} type="date"
                                           name="due_date"
                                           className="form-control"
                                           id="form_edit_due_date"></input>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="form_edit_duty_date">DÚZP</label>
                                    <input defaultValue={invoice.dutyDate?.date.substring(0, 10)} type="date"
                                           name="duty_date"
                                           className="form-control"
                                           id="form_edit_duty_date"></input>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="form_edit_duty_date">Zaplaceno</label>

                                    <div className="form-check form-switch">
                                        <input className="form-check-input"
                                               name="payed"
                                               type="checkbox"
                                               defaultChecked={invoice.payed}
                                               id="form_edit_payed"/>
                                        <label className="form-check-label" htmlFor="form_edit_payed">Zaplaceno</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {id ? "Uložit" : "Přidat"}
                        </button>
                    </form>
                )
                }
            </>
        )
            ;
    }
;

export default InvoiceFormDefault;