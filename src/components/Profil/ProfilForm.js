import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";

const ProfilForm = ({id, handleSave}) => {
    const {API} = useRootContext()
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/user/single/" + id, (data) => {
                setUser(data);
            });
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }

        API.postData("/profil/save", formData, (data) => {
            setUser(data.user);

            if (handleSave) {
                handleSave(data.user);
            }
        });
    }

    return (
        <>
            {user && "name" in user && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_password">Nové heslo</label>
                        <input type="password" name="password" className="form-control"
                               id="form_edit_password"/>
                    </div>
                    <div className="row">
                        <div className="col-sm-6">
                            <div className="mb-3">
                                <label htmlFor="form_edit_name">Jméno</label>
                                <input defaultValue={user.name} type="text" name="name" className="form-control"
                                       id="form_edit_name"/>
                            </div>
                        </div>
                        <div className="col-sm-6">
                            <div className="mb-3">
                                <label htmlFor="form_edit_surname">Příjmení</label>
                                <input defaultValue={user.surname} type="text" name="surname" className="form-control"
                                       id="form_edit_surname"/>
                            </div>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_username">E-mail</label>
                        <input defaultValue={user.username} type="email" name="username" className="form-control"
                               id="form_edit_username"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_phone">Telefon</label>
                        <input defaultValue={user.phone} type="text" name="phone" className="form-control"
                               id="form_edit_phone"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_new_file">Avatar</label>
                        <input type="file" name="avatar" className="form-control" id="form_new_avatar"/>
                        {user.avatar && user.avatar.length > 0 && (
                            <>
                                <a target="_blank" href={CONFIG.uploadDir + user.avatar}>{user.avatar}</a>
                                <br/>
                                <div className="form-check form-switch"><input className="form-check-input"
                                                                               name="avatar_delete"
                                                                               type="checkbox"
                                                                               id="form_edit_avatar_delete"/>
                                    <label className="form-check-label" htmlFor="form_edit_avatar_delete">Smazat</label>
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

export default ProfilForm;