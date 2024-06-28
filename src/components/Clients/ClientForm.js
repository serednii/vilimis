import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";

const clientBlank = {
    name: "",
    address: "",
    ic: "",
    dic: "",
    email: "",
    phone: "",
    web: "",
    hourRate: "",
    logo: "",
}

const ClientForm = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/client/single/" + id, (data) => {
                setClient(data);
            });
        } else {
            setClient(clientBlank)
        }
    }, [id]);

    function handleDelete(id) {
        API.getData("/client/delete/"+id, ()=>{
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

        API.postData("/client/save", formData, (data) => {
            setClient(data.client);

            if (handleSave) {
                handleSave(data.client);
            }
        });
    }

    return (
        <>
            {client && "name" in client && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={client.name} type="text" name="name" className="form-control"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_address">Adresa</label>
                        <textarea defaultValue={client.address} className="form-control" name="address"
                                  rows="10"
                                  id="form_edit_address"></textarea>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_ic">IČ</label>
                        <input defaultValue={client.ic} type="text" name="ic" className="form-control"
                               id="form_edit_ic"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_dic">DIČ</label>
                        <input type="text" name="dic" className="form-control" id="form_edit_dic"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_hour_rate">Hodinová sazba</label>
                        <input defaultValue={client.hourRate} type="number" name="hour_rate"
                               className="form-control"
                               id="form_edit_hour_rate"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_email">Email</label>
                        <input defaultValue={client.email} type="text" name="email" className="form-control"
                               id="form_edit_email"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_phone">Telefon</label>
                        <input defaultValue={client.phone} type="text" name="phone" className="form-control"
                               id="form_edit_phone"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_web">Web</label>
                        <input defaultValue={client.web} type="text" name="web" className="form-control"
                               id="form_edit_web"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_new_logo">Logo</label>
                        <input type="file" name="logo" className="form-control" id="form_new_logo"/>
                        {client.logo && client.logo.length > 0 && (
                            <>
                                <img src={CONFIG.uploadDir + client.logo}/>
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

export default ClientForm;