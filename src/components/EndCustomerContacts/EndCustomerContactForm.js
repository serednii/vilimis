import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import EndCustomersSelectList from "../EndCustomers/EndCustomersSelectList";

const endCustomerContactBlank = {
    name: "",
    surname: "",
    position: "",
    phone: "",
    email: "",
    photo: "",
    endCustomerId: null
}

const EndCustomerContactForm = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [endCustomerContact, setEndCustomerContact] = useState(null);
    const [selectedEndCustomerId, setSelectedEndCustomerId] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/endCustomerContact/single/" + id, (data) => {
                setEndCustomerContact(data);
            });
        } else {
            setEndCustomerContact(endCustomerContactBlank)
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/endCustomerContact/save", formData, (data) => {
            setEndCustomerContact(data.endCustomerContact);

            if (handleSave) {
                handleSave(data.endCustomerContact);
            }
        });
    }

    return (
        <>
            {endCustomerContact && "name" in endCustomerContact && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_client_id">Koncový zákazník</label>
                        <EndCustomersSelectList selected={endCustomerContact.endCustomerId}
                                                onChange={setSelectedEndCustomerId}/>
                        <input type="hidden" name="end_customer_id" value={selectedEndCustomerId}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Jmeno</label>
                        <input defaultValue={endCustomerContact.name} type="text" name="name" className="form-control"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_surname">Přijmeni</label>
                        <input defaultValue={endCustomerContact.surname} type="text" name="surname"
                               className="form-control"
                               id="form_edit_surname"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_position">Pozice</label>
                        <input defaultValue={endCustomerContact.position} type="text" name="position"
                               className="form-control"
                               id="form_edit_position"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_address">Adresa</label>
                        <textarea defaultValue={endCustomerContact.address} className="form-control" name="address"
                                  rows="10"
                                  id="form_edit_address"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_email">Email</label>
                        <input defaultValue={endCustomerContact.email} type="text" name="email" className="form-control"
                               id="form_edit_email"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_phone">Telefon</label>
                        <input defaultValue={endCustomerContact.phone} type="text" name="phone" className="form-control"
                               id="form_edit_phone"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_new_photo">Foto</label>
                        <input type="file" name="photo" className="form-control" id="form_new_photo"/>
                        {endCustomerContact.photo && endCustomerContact.photo.length > 0 && (
                            <>
                                <img src={CONFIG.uploadDir + endCustomerContact.photo}/>
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

export default EndCustomerContactForm;