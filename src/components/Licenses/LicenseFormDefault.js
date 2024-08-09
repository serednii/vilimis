import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ClientsSelectList from "../Clients/ClientsSelectList";
import LicensesSelectList from "./LicensesSelectList";
import CostsSelectList from "../Costs/CostsSelectList";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import EndCustomersSelectList from "../EndCustomers/EndCustomersSelectList";



const LicenseFormDefault = ({id, handleSave, clientId, projectId, endCustomerId, beforeLicenseId, afterLicenseId, costId}) => {
    const {API} = useRootContext()
    const [license, setLicense] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedEndCustomerId, setSelectedEndCustomerId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedBeforeLicenseId, setSelectedBeforeLicenseId] = useState(null);
    const [selectedAfterLicenseId, setSelectedAfterLicenseId] = useState(null);
    const [selectedCostId, setSelectedCostId] = useState(null);

    const licenseBlank = {
        name: "",
        description: "",
        clientId: "",
        endCustomerId: "",
        projectId: "",
        costId: "",
        amount: 0,
        dateFrom: null,
        dateTo: null,
        beforeLicenseId: "",
        afterLicenseId: "",
    }

    useEffect(() => {
        if (id) {
            API.getData("/license/single/" + id, (data) => {
                setLicense(data);
            });
        } else {
            if (clientId) {
                licenseBlank.clientId = clientId;
            }
            if (projectId) {
                licenseBlank.projectId = projectId;
            }
            if (endCustomerId) {
                licenseBlank.endCustomerId = endCustomerId;
            }
            if (beforeLicenseId) {
                licenseBlank.beforeLicenseId = beforeLicenseId;
            }
            if (afterLicenseId) {
                licenseBlank.afterLicenseId = afterLicenseId;
            }
            if (costId) {
                licenseBlank.costId = costId;
            }
            setLicense(licenseBlank)
        }
    }, [id]);

    function handleDelete(id) {
        API.getData("/license/delete/"+id, ()=>{
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

        API.postData("/license/save", formData, (data) => {
            setLicense(data.license);

            if (handleSave) {
                handleSave(data.license);
            }
        });
    }

    return (
        <>
            {license && "name" in license && (
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6">

                            <div className="mb-3">
                                <label htmlFor="form_edit_name">Název</label>
                                <input defaultValue={license.name} type="text" name="name"
                                       className="form-control form-control-lg"
                                       id="form_edit_name"/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_description">Popis</label>
                                <textarea defaultValue={license.description} className="form-control" name="description"
                                          rows="10"
                                          id="form_edit_description"></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_date_from">Platnost od</label>
                                <input defaultValue={license.dateFrom?.date.substring(0, 10)} type="date"
                                       name="date_from"
                                       className="form-control"
                                       id="form_edit_date_from"></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_date_to">Platnost do</label>
                                <input defaultValue={license.dateTo?.date.substring(0, 10)} type="date"
                                       name="date_to"
                                       className="form-control"
                                       id="form_edit_date_to"></input>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_amount">Částka</label>
                                <input defaultValue={license.amount} type="number" name="amount"
                                       step="0.01"
                                       className="form-control"
                                       id="form_edit_amount"/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="form_edit_client_id">Klient</label>
                                <ClientsSelectList selected={license.clientId} onChange={setSelectedClientId}/>
                                <input type="hidden" name="client_id"
                                       value={selectedClientId ? selectedClientId : 0}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_endCustomer_id">Koncový zákazník</label>
                                <EndCustomersSelectList selected={license.endCustomerId}
                                                        onChange={setSelectedEndCustomerId}/>
                                <input type="hidden" name="end_customer_id"
                                       value={selectedEndCustomerId ? selectedEndCustomerId : 0}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_project_id">Projekt</label>
                                <ProjectsSelectList selected={license.projectId} onChange={setSelectedProjectId}/>
                                <input type="hidden" name="project_id"
                                       value={selectedProjectId ? selectedProjectId : 0}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_cost_id">Náklad</label>
                                <CostsSelectList license={license} selected={license.costId} onChange={setSelectedCostId}/>
                                <input type="hidden" name="cost_id"
                                       value={selectedCostId ? selectedCostId : 0}/>
                            </div>
                            <hr/>
                            <div className="mb-3">
                                <label htmlFor="form_edit_beforeLicense_id">Předchozí licence</label>
                                <LicensesSelectList selected={license.beforeLicenseId}
                                                    onChange={setSelectedBeforeLicenseId}/>
                                <input type="hidden" name="before_license_id"
                                       value={selectedBeforeLicenseId ? selectedBeforeLicenseId : 0}/>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_afterLicense_id">Navazující licence</label>
                                <LicensesSelectList selected={license.afterLicenseId}
                                                    onChange={setSelectedAfterLicenseId}/>
                                <input type="hidden" name="after_license_id"
                                       value={selectedAfterLicenseId ? selectedAfterLicenseId : 0}/>
                            </div>
                        </div>
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

export default LicenseFormDefault;