import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import SessionTypesSelectList from "../SessionTypes/SessionTypesSelectList";
import ClientsSelectList from "../Clients/ClientsSelectList";
import EndCustomersSelectList from "../EndCustomers/EndCustomersSelectList";
import EndCustomerContactsSelectList from "../EndCustomerContacts/EndCustomerContactsSelectList";

const sessionBlank = {
    name: "",
    color: "",
    priority: "",
    done: false,
    sessionTypeId: null,
    clientId: null,
    date: ''
}

const SessionForm = ({id, handleSave, projectId}) => {
    const {API} = useRootContext()
    const [session, setSession] = useState(null);
    const [sessionEndCustomerContacts, setSessionEndCustomerContacts] = useState([]);
    const [selectedSessionTypeId, setSelectedSessionTypeId] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedEndCustomerId, setSelectedEndCustomerId] = useState(null);
    const [selectedEndCustomerContactIds, setSelectedEndCustomerContactIds] = useState([]);

    useEffect(() => {
        API.getData("/sessionEndCustomerContact/list?filter[session_id]=" + id, (data) => {

            let ids = [];
            if (data && data.length > 0) {
                data.forEach(d=>{
                    ids.push(d.endCustomerContact)
                });
            }
            console.log(ids)
            setSessionEndCustomerContacts(ids);
        });

        if (id) {
            API.getData("/session/single/" + id, (data) => {
                setSession(data);
            });
        } else {
            setSession(sessionBlank)
        }
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }
        
        formData.append("project_id", projectId);

        let end_customer_contact_ids = formData.getAll("end_customer_contact_ids[]");

        API.postData("/session/save", formData, (data) => {
            if (data.session.id && end_customer_contact_ids && end_customer_contact_ids.length > 0) {
                end_customer_contact_ids.forEach(end_customer_contact_id=>{
                    let formDataEcc = new FormData;
                    formDataEcc.append("session_id", data.session.id);
                    formDataEcc.append("end_customer_contact", end_customer_contact_id);
                    API.postData("/sessionEndCustomerContact/save", formDataEcc, (data) => {

                    });
                })
            }

            setSession(data.session);

            if (handleSave) {
                handleSave(data.session);
            }
        });
    }

    if (!session) {
        return ("....");
    }

    session.dateFormated = "";
    if (session && "date" in session && session.date && "date" in session.date) {
        session.dateFormated = session.date.date.substring(0, 10)
    }

    return (
        <>
            {session && "name" in session && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <div className="mb-3">
                            <label htmlFor="form_edit_name">Název</label>
                            <input defaultValue={session.name} type="text" name="name" className="form-control"
                                   id="form_edit_name"/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_date">Datum setkání</label>
                            <input defaultValue={session.datetimeOfSession.date.substring(0, 16)} type="datetime-local"
                                   name="datetime_of_session"
                                   className="form-control"
                                   id="form_edit_datetime_of_session"></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_description">Přepis</label>
                            <textarea defaultValue={session.description} className="form-control" name="description"
                                      rows="10"
                                      id="form_edit_description"></textarea>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_sessionType_id">Typ setkání</label>
                            <SessionTypesSelectList selected={session.sessionTypeId}
                                                    onChange={setSelectedSessionTypeId}/>
                            <input type="hidden" name="session_type_id" value={selectedSessionTypeId}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_client_id">Klient</label>
                            <ClientsSelectList selected={session.clientId} onChange={setSelectedClientId}/>
                            <input type="hidden" name="client_id" value={selectedClientId}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_project_id">Projekt</label>
                            <ProjectsSelectList selected={session.projectId} onChange={setSelectedProjectId}/>
                            <input type="hidden" name="project_id" value={selectedProjectId}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_client_id">Koncový zákazník</label>
                            <EndCustomersSelectList selected={session.endCustomerId}
                                                    onChange={setSelectedEndCustomerId}/>
                            <input type="hidden" name="end_customer_id" value={selectedEndCustomerId}/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="form_edit_client_id">Koncový zákazník - kontakty</label>
                            <EndCustomerContactsSelectList multiple={true} onChange={setSelectedEndCustomerContactIds}  selected={sessionEndCustomerContacts} />
                            {selectedEndCustomerContactIds && selectedEndCustomerContactIds.length > 0 && selectedEndCustomerContactIds.map(selectedEndCustomerContactId=>(
                                <input key={selectedEndCustomerContactId} type="hidden" name="end_customer_contact_ids[]" value={selectedEndCustomerContactId}/>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default SessionForm;