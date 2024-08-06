import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import BudgetCalculator from "../../utils/BudgetCalculator";
import {Plus} from "@phosphor-icons/react";

const invoiceItemBlank = {
    id: "",
    item: "",
    vat: "0",
    quantity: "1",
    unit: "kus",
    code: "SW",
    priceWithoutVat: "0",
}
const InvoiceItemsList = ({invoiceId}) => {
    const {API} = useRootContext()
    const [invoiceItems, setInvoiceItems] = useState([]);

    useEffect(() => {
        loadInvoiceItems();
    }, [invoiceId]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (invoiceId) {
            formData.append("invoice_id", invoiceId);
        }

        API.postData("/invoiceItems/save", formData, () => {
            loadInvoiceItems();
        });
    }

    function loadInvoiceItems() {
        let url = "/invoiceItem/list";
        if (invoiceId) {
            url += "?order=id"
            if (invoiceId) {
                url += "&filter[invoice_id]="+encodeURIComponent(invoiceId);
            }
        }
        API.getData(url, (invoiceItems) => {
            setInvoiceItems(invoiceItems);
        });
    }

    let total = 0;

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Položky faktury</h1></div>
            </div>

            <div className="card border-0 shadow mb-4">
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-4 rounded">
                            <thead className="thead-light">
                            <tr>
                                <th className="border-0 rounded-start">#</th>
                                <th className="border-0">Kód</th>
                                <th className="border-0">Položka</th>
                                <th className="border-0">DPH</th>
                                <th className="border-0">Počet</th>
                                <th className="border-0">Jednotka</th>
                                <th className="border-0">Cena bez DPH</th>
                                <th className="border-0 rounded-end">Akce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {invoiceItems && invoiceItems.length > 0 && invoiceItems.map((invoiceItem, invoiceItem_key) => (
                                <tr key={invoiceItem_key + "-" + invoiceItem.id + "-" + invoiceItems.length}>
                                    <td width="50">
                                        {(total = total + (invoiceItem.quantity * invoiceItem.priceWithoutVat)) && ""}
                                        <input type="hidden"
                                               name="invoice_items[id][]"
                                               value={invoiceItem.id}/>
                                        {invoiceItem.id}
                                    </td>
                                    <td width="100">
                                        <input defaultValue={invoiceItem.code} type="text"
                                               name="invoice_items[code][]"
                                               onChange={(e) => {
                                                   invoiceItems[invoiceItem_key].code = e.target.value;
                                                   setInvoiceItems([...invoiceItems]);
                                               }}
                                               className="form-control"/>
                                    </td>
                                    <td>
                                        <input defaultValue={invoiceItem.item} type="text"
                                               name="invoice_items[item][]"
                                               onChange={(e) => {
                                                   invoiceItems[invoiceItem_key].item = e.target.value;
                                                   setInvoiceItems([...invoiceItems]);
                                               }}
                                               className="form-control"/>
                                    </td>
                                    <td width="100">
                                        <select className="form-control"
                                                name="invoice_items[vat][]"
                                                defaultValue={invoiceItem.vat}
                                                onChange={(e) => {
                                                    invoiceItems[invoiceItem_key].vat = e.target.value;
                                                    setInvoiceItems([...invoiceItems]);
                                                }}>
                                            <option value="0">0%</option>
                                            <option value="15">15%</option>
                                            <option value="21">21%</option>
                                        </select>
                                    </td>
                                    <td width="100">
                                        <input defaultValue={invoiceItem.quantity} type="number"
                                               name="invoice_items[quantity][]"
                                               className="form-control"
                                               onChange={(e) => {
                                                   invoiceItems[invoiceItem_key].quantity = e.target.value;
                                                   setInvoiceItems([...invoiceItems]);
                                               }}/>
                                    </td>
                                    <td width="100">
                                        <input defaultValue={invoiceItem.unit} type="text"
                                               name="invoice_items[unit][]"
                                               onChange={(e) => {
                                                   invoiceItems[invoiceItem_key].unit = e.target.value;
                                                   setInvoiceItems([...invoiceItems]);
                                               }}
                                               className="form-control"/>
                                    </td>
                                    <td width="100">
                                        <input defaultValue={invoiceItem.priceWithoutVat} type="number"
                                               name="invoice_items[price_without_vat][]"
                                               step="0.01"
                                               className="form-control"
                                               onChange={(e) => {
                                                   invoiceItems[invoiceItem_key].priceWithoutVat = e.target.value;
                                                   setInvoiceItems([...invoiceItems]);
                                               }}/></td>
                                    <td width="100">
                                        <button
                                            onClick={() => window.confirm("Opravdu smazat?") && invoiceItems.splice(invoiceItem_key, 1) && setInvoiceItems([...invoiceItems])}
                                            className="btn btn-sm btn-danger" type="button">Smazat
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <p className="float-end">Celkem: <strong>{(new BudgetCalculator)._numberFormat(total, 2, ".", " ")} Kč</strong></p>
                        <p>
                            <button className="btn btn-primary" type="submit">Uložit</button>&nbsp;
                            <button className="btn btn-primary" type="button" onClick={() => {
                                invoiceItems.push(structuredClone(invoiceItemBlank));
                                setInvoiceItems([...invoiceItems]);
                            }}><Plus/></button>
                        </p>
                    </div>
                </form>
            </div>

        </>
    );
};

export default InvoiceItemsList;