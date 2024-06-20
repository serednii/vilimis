import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import ClientsSelectList from "../Clients/ClientsSelectList";

const clientContactBlank = {
    name: "",
    surname: "",
    position: "",
    phone: "",
    email: "",
    photo: "",
    clientId: null
}

const ClientContactForm = ({id, handleSave, clientId}) => {
    const {API} = useRootContext()
    const [clientContact, setClientContact] = useState(null);
    const [selectedClientId, setSelectedClientId] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/clientContact/single/" + id, (data) => {
                setClientContact(data);
            });
        } else {
            setClientContact(clientContactBlank)
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/clientContact/save", formData, (data) => {
            setClientContact(data.clientContact);

            if (handleSave) {
                handleSave(data.clientContact);
            }
        });
    }

    return (
        <>
            {clientContact && "name" in clientContact && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_client_id">Klient</label>
                        <ClientsSelectList selected={clientContact.clientId ? clientContact.clientId : (clientId?clientId:"")}
                                                onChange={setSelectedClientId}/>
                        <input type="hidden" name="client_id" value={selectedClientId}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Jmeno</label>
                        <input defaultValue={clientContact.name} type="text" name="name" className="form-control"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_surname">Přijmeni</label>
                        <input defaultValue={clientContact.surname} type="text" name="surname"
                               className="form-control"
                               id="form_edit_surname"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_position">Pozice</label>
                        <input defaultValue={clientContact.position} type="text" name="position"
                               className="form-control"
                               id="form_edit_position"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_address">Adresa</label>
                        <textarea defaultValue={clientContact.address} className="form-control" name="address"
                                  rows="10"
                                  id="form_edit_address"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_email">Email</label>
                        <input defaultValue={clientContact.email} type="text" name="email" className="form-control"
                               id="form_edit_email"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_phone">Telefon</label>
                        <input defaultValue={clientContact.phone} type="text" name="phone" className="form-control"
                               id="form_edit_phone"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_new_photo">Foto</label>
                        <input type="file" name="photo" className="form-control" id="form_new_photo"/>
                        {clientContact.photo && clientContact.photo.length > 0 && (
                            <>
                                <img src={CONFIG.uploadDir + clientContact.photo}/>
                                <br/>
                                <div className="form-check form-switch"><input className="form-check-input"
                                                                               name="photo_delete"
                                                                               type="checkbox"
                                                                               id="form_edit_photo_delete"/>
                                    <label className="form-check-label" htmlFor="form_edit_photo_delete">Smazat</label>
                                </div>
                            </>
                        )}
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default ClientContactForm;