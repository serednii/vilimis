import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import ClientsSelectList from "../Clients/ClientsSelectList";
import EndCustomersSelectList from "../EndCustomers/EndCustomersSelectList";
import WebsSelectList from "./WebsSelectList";
import {CONFIG} from "../../config";
import CypherTextarea from "../../formTypes/CypherTextarea";

const webBlank = {
    name: "",
    url: "",
    parentWebId: null,
    logo: "",
}

const WebFormDefault = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [web, setWeb] = useState(null);
    const [selectedParentWebId, setSelectedParentWebId] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedEndCustomerId, setSelectedEndCustomerId] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/web/single/" + id, (data) => {
                setWeb(data);
            });
        } else {
            setWeb(webBlank)
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/web/save", formData, (data) => {
            setWeb(data.web);

            if (handleSave) {
                handleSave(data.web);
            }
        });
    }

    if (!web) {
        return (<>Načítaní..</>)
    }

    web.deadLineDateFormated = "";
    if (web && "deadLineDate" in web && web.deadLineDate && "date" in web.deadLineDate) {
        web.deadLineDateFormated = web.deadLineDate.date.substring(0, 16)
    }

    return (
        <>
            {web && "name" in web && (
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-12 col-md-8">
                            <div className="mb-3">
                                <label htmlFor="form_edit_name">Název</label>
                                <input defaultValue={web.name} type="text" name="name" className="form-control"
                                       id="form_edit_name"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_url">URL</label>
                                <input defaultValue={web.url} type="text" name="url" className="form-control"
                                       id="form_edit_url"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_accesses">Přístupy</label>
                                <CypherTextarea defaultIsCrypted={web.accessesCrypted}
                                                defaultValue={web.accesses}
                                                className="form-control"
                                                name="accesses"
                                                nameIsCrypted="accesses_crypted"
                                          rows="10"
                                          id="form_edit_accesses"/>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="mb-3">
                                <label htmlFor="form_edit_client_id">Klient</label>
                                <ClientsSelectList selected={web.clientId}
                                                   onChange={setSelectedClientId}/>
                                <input type="hidden" name="client_id" value={selectedClientId}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_end_customer_id">Koncový zákaznik</label>
                                <EndCustomersSelectList selected={web.endCustomerId}
                                                        onChange={setSelectedEndCustomerId}/>
                                <input type="hidden" name="end_customer_id" value={selectedEndCustomerId}/>
                            </div>
                            <hr/>
                            <div className="mb-3">
                                <label htmlFor="form_edit_parent_web_id">Nadřazený web</label>
                                <WebsSelectList selected={web.parentWebId} onChange={setSelectedParentWebId}/>
                                <input type="hidden" name="parent_web_id" value={selectedParentWebId}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_new_logo">Logo</label>
                                <input type="file" name="logo" className="form-control" id="form_new_logo"/>
                                {web.logo && web.logo.length > 0 && (
                                    <>
                                        <img src={CONFIG.uploadDir + web.logo}/>
                                        <br/>
                                        <div className="form-check form-switch"><input className="form-check-input"
                                                                                       name="logo_delete"
                                                                                       type="checkbox"
                                                                                       id="form_edit_logo_delete"/>
                                            <label className="form-check-label"
                                                   htmlFor="form_edit_logo_delete">Smazat</label>
                                        </div>
                                    </>
                                )}
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

export default WebFormDefault;