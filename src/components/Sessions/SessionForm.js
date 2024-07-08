import React, {useEffect, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import ProjectsSelectList from "../Projects/ProjectsSelectList";
import SessionTypesSelectList from "../SessionTypes/SessionTypesSelectList";
import ClientsSelectList from "../Clients/ClientsSelectList";
import EndCustomersSelectList from "../EndCustomers/EndCustomersSelectList";
import EndCustomerContactsSelectList from "../EndCustomerContacts/EndCustomerContactsSelectList";
import ClientContactsSelectList from "../ClientContacts/ClientContactsSelectList";
import JoditEditor from "jodit-react";

const sessionBlank = {
    name: "",
    color: "",
    priority: "",
    done: false,
    sessionTypeId: null,
    clientId: null,
    datetimeOfSession: ''
}

const SessionForm = ({id, handleSave, projectId, clientId}) => {
    const {API} = useRootContext()
    const [session, setSession] = useState(null);
    const [sessionEndCustomerContacts, setSessionEndCustomerContacts] = useState([]);
    const [sessionClientContacts, setSessionClientContacts] = useState([]);
    const [selectedSessionTypeId, setSelectedSessionTypeId] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedEndCustomerId, setSelectedEndCustomerId] = useState(null);
    const [selectedEndCustomerContactIds, setSelectedEndCustomerContactIds] = useState([]);
    const [selectedClientContactIds, setSelectedClientContactIds] = useState([]);

    const editor = useRef(null);
    const [content, setContent] = useState('');

    useEffect(() => {
        API.getData("/sessionEndCustomerContact/list?filter[session_id]=" + id, (data) => {

            let ids = [];
            if (data && data.length > 0) {
                data.forEach(d=>{
                    ids.push(parseInt(d.endCustomerContactId))
                });
            }

            setSessionEndCustomerContacts(ids);
        });

        API.getData("/sessionClientContact/list?filter[session_id]=" + id, (data) => {

            let ids = [];
            if (data && data.length > 0) {
                data.forEach(d=>{
                    ids.push(parseInt(d.clientContactId))
                });
            }

            setSessionClientContacts(ids);
        });

        if (id) {
            API.getData("/session/single/" + id, (data) => {
                setContent(data.description);
                setSession(data);
            });
        } else {
            setSession(sessionBlank)
        }
    }, []);

    function handleDelete(id) {
        API.getData("/session/delete/"+id, ()=>{
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

        let end_customer_contact_ids = formData.getAll("end_customer_contact_ids[]");
        let client_contact_ids = formData.getAll("client_contact_ids[]");

        API.postData("/session/save", formData, (data) => {
            if (data.session.id && end_customer_contact_ids && end_customer_contact_ids.length > 0) {
                end_customer_contact_ids.forEach((end_customer_contact_id, index)=>{
                    end_customer_contact_id = parseInt(end_customer_contact_id);
                    end_customer_contact_ids[index] = end_customer_contact_id;
                    if (!(sessionEndCustomerContacts.includes(parseInt(end_customer_contact_id)))) {
                        let formDataEcc = new FormData;
                        formDataEcc.append("session_id", data.session.id);
                        formDataEcc.append("end_customer_contact_id", end_customer_contact_id);
                        API.postData("/sessionEndCustomerContact/save", formDataEcc, null, true);
                    }
                })
            }

            if (sessionEndCustomerContacts && sessionEndCustomerContacts.length > 0) {
                sessionEndCustomerContacts.forEach(sessionEndCustomerContact => {
                    if (!(end_customer_contact_ids.includes(parseInt(sessionEndCustomerContact)))) {
                        let formDataEcc = new FormData;
                        formDataEcc.append("session_id", data.session.id);
                        formDataEcc.append("end_customer_contact", sessionEndCustomerContact);
                        API.getData("/sessionEndCustomerContact/deleteByFilter?filter[session_id]=" + data.session.id + "&filter[end_customer_contact_id]="  + sessionEndCustomerContact, null, true);
                    }
                })
            }

            if (data.session.id && client_contact_ids && client_contact_ids.length > 0) {
                client_contact_ids.forEach((client_contact_id, index)=>{
                    client_contact_id = parseInt(client_contact_id);
                    client_contact_ids[index] = client_contact_id;
                    if (!(sessionClientContacts.includes(parseInt(client_contact_id)))) {
                        let formDataEcc = new FormData;
                        formDataEcc.append("session_id", data.session.id);
                        formDataEcc.append("client_contact_id", client_contact_id);
                        API.postData("/sessionClientContact/save", formDataEcc, null, true);
                    }
                })
            }

            if (sessionClientContacts && sessionClientContacts.length > 0) {
                sessionClientContacts.forEach(sessionClientContact => {
                    if (!(client_contact_ids.includes(parseInt(sessionClientContact)))) {
                        let formDataEcc = new FormData;
                        formDataEcc.append("session_id", data.session.id);
                        formDataEcc.append("client_contact", sessionClientContact);
                        API.getData("/sessionClientContact/deleteByFilter?filter[session_id]=" + data.session.id + "&filter[client_contact_id]="  + sessionClientContact, null, true);
                    }
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
                    <div className="row">
                        <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="form_edit_name">Název</label>
                                    <input defaultValue={session.name} type="text" name="name" className="form-control"
                                           id="form_edit_name" required={true}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_date">Datum setkání</label>
                                    <input
                                        defaultValue={session.datetimeOfSession && session.datetimeOfSession.date.substring(0, 16)}
                                        type="datetime-local"
                                        name="datetime_of_session"
                                        className="form-control"
                                        id="form_edit_datetime_of_session" required={true}></input>
                                </div>
                            <div className="mb-3">
                                <label htmlFor="form_edit_description">Přepis</label>
                                <input type="hidden" name="description" value={content}/>

                                <JoditEditor
                                    ref={editor}
                                    value={content}
                                    config={CONFIG.joedit}
                                    onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                    onChange={newContent => {
                                    }}
                                />
                            </div>
                            <div className="mb-3">
                            <label htmlFor="form_edit_sessionType_id">Typ setkání</label>
                                    <SessionTypesSelectList selected={session.sessionTypeId}
                                                            onChange={setSelectedSessionTypeId}/>
                                    <input type="hidden" name="session_type_id" value={selectedSessionTypeId}/>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="mb-3">
                                    <label htmlFor="form_edit_project_id">Projekt</label>
                                    <ProjectsSelectList
                                        selected={session.projectId ? session.projectId : (projectId ? projectId : "")}
                                        onChange={setSelectedProjectId}/>
                                    <input type="hidden" name="project_id" value={selectedProjectId}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_client_id">Klient</label>
                                    <ClientsSelectList
                                        selected={session.clientId ? session.clientId : (clientId ? clientId : "")}
                                        onChange={setSelectedClientId}/>
                                    <input type="hidden" name="client_id" value={selectedClientId}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_client_id">Klient - kontakty</label>
                                    <ClientContactsSelectList multiple={true} onChange={setSelectedClientContactIds}
                                                              selected={sessionClientContacts}
                                                              clientId={selectedClientId}
                                    />
                                    {selectedClientContactIds && selectedClientContactIds.length > 0 && selectedClientContactIds.map(selectedClientContactId => (
                                        <React.Fragment key={selectedClientContactId}>
                                            <input type="hidden" name="client_contact_ids[]"
                                                   value={selectedClientContactId}/>
                                        </React.Fragment>
                                    ))}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_client_id">Koncový zákazník</label>
                                    <EndCustomersSelectList selected={session.endCustomerId}
                                                            onChange={setSelectedEndCustomerId}/>
                                    <input type="hidden" name="end_customer_id" value={selectedEndCustomerId}/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="form_edit_client_id">Koncový zákazník - kontakty</label>
                                    <EndCustomerContactsSelectList multiple={true}
                                                                   onChange={setSelectedEndCustomerContactIds}
                                                                   selected={sessionEndCustomerContacts}
                                                                   endCustomerId={selectedEndCustomerId}
                                    />
                                    {selectedEndCustomerContactIds && selectedEndCustomerContactIds.length > 0 && selectedEndCustomerContactIds.map(selectedEndCustomerContactId => (
                                        <React.Fragment key={selectedEndCustomerContactId}>
                                            <input type="hidden" name="end_customer_contact_ids[]"
                                                   value={selectedEndCustomerContactId}/>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>

                    {!!id && (
                        <button
                            onClick={() => window.confirm("Opravdu smazat?") && handleDelete(id)}
                            className="btn btn-danger ms-3" type="button">Smazat</button>
                    )}
                </form>
            )}
        </>
    );
};

export default SessionForm;