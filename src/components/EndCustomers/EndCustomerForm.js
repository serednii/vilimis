import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import ClientsSelectList from "../Clients/ClientsSelectList";
import {MagnifyingGlass} from "@phosphor-icons/react";
import IcoFinder from "../Ares/IcoFinder";

const endCustomerBlank = {
    name: "",
    address: "",
    ic: "",
    web: "",
    logo: "",
    clientId: null
}

const EndCustomerForm = ({id, handleSave, clientId}) => {
    const {API} = useRootContext()
    const [endCustomer, setEndCustomer] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        if (clientId) {
            endCustomerBlank.clientId = clientId;
        } else {
            endCustomerBlank.clientId = null;
        }
        if (id) {
            API.getData("/endCustomer/single/" + id, (data) => {
                setEndCustomer(data);
            });
        } else {
            setEndCustomer(endCustomerBlank)
        }
    }, [id, clientId]);

    function handleDelete(id) {
        API.getData("/endCustomer/delete/"+id, ()=>{
            if (handleSave) {
                handleSave();
            }
        });
    }

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/endCustomer/save", formData, (data) => {
            setEndCustomer(data.endCustomer);

            if (handleSave) {
                handleSave(data.endCustomer);
            }
        });
    }
    console.log(endCustomer);

    return (
        <>
            {endCustomer && "name" in endCustomer && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_client_id">Klient</label>
                        <ClientsSelectList selected={endCustomer.clientId} onChange={setSelectedClientId}/>
                        <input type="hidden" name="client_id" value={selectedClientId?selectedClientId:0}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input key={"name"+endCustomer.address} defaultValue={endCustomer.name} type="text" name="name" className="form-control"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_address">Adresa</label>
                        <textarea key={"address"+endCustomer.address} defaultValue={endCustomer.address} className="form-control" name="address"
                                  rows="10"
                                  id="form_edit_address"></textarea>

                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_ic">IČ</label>
                        <IcoFinder name="ic" defaultValue={endCustomer.ic}
                                   id="form_edit_ic"
                                   onFind={(data)=>{
                                       if (!data.name) return;
                            setEndCustomer((prev) =>({
                                ...prev,
                                name: data.name,
                                dic: data.dic,
                                address: data.address
                            }));
                        }}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_web">Web</label>
                        <input defaultValue={endCustomer.web} type="text" name="web" className="form-control"
                               id="form_edit_web"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_new_logo">Logo</label>
                        <input type="file" name="logo" className="form-control" id="form_new_logo"/>
                        {endCustomer.logo && endCustomer.logo.length > 0 && (
                            <>
                                <img src={CONFIG.uploadDir + endCustomer.logo}/>
                                <br/>
                                <div className="form-check form-switch"><input className="form-check-input"
                                                                               name="logo_delete"
                                                                               type="checkbox"
                                                                               id="form_edit_logo_delete"/>
                                    <label className="form-check-label" htmlFor="form_edit_logo_delete">Smazat</label>
                                </div>
                            </>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>

                    {!!id && (
                        <button
                            onClick={() => window.confirm("Opravdu smazat?") && handleDelete(id)}
                            className="btn btn-danger float-end" type="button">Smazat</button>
                    )}
                </form>
            )}
        </>
    );
};

export default EndCustomerForm;