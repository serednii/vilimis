import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";

const attachmentBlank = {
    name: "",
}

const AttachmentForm = ({id, handleSave, entity, entityId}) => {
    const {API} = useRootContext()
    const [attachment, setAttachment] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/attachment/single/" + id, (data) => {
                setAttachment(data);
            });
        } else {
            setAttachment(attachmentBlank)
        }
    }, [id]);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        if (id) {
            formData.append("id", id);
        }
        
        formData.append("entity", entity);
        formData.append("entity_id", entityId);

        if (id && attachment && "created" in attachment && attachment.created && "date" in attachment.created) {
            formData.append("created", attachment.created.date);
        } else {
            formData.append("created", (new Date()).toISOString());
        }

        API.postData("/attachment/save", formData, (data) => {
            setAttachment(data.attachment);

            if (handleSave) {
                handleSave(data.attachment);
            }
        });
    }

    return (
        <>
            {attachment && "name" in attachment && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název</label>
                        <input defaultValue={attachment.name} type="text" name="name" className="form-control"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_new_file">Soubor</label>
                        <input type="file" name="file" className="form-control" id="form_new_file"/>
                        {attachment.file && attachment.file.length > 0 && (
                            <>
                                <a target="_blank" href={CONFIG.uploadDir + attachment.file}>{attachment.file}</a>
                                <br/>
                                <div className="form-check form-switch"><input className="form-check-input"
                                                                               name="file_delete"
                                                                               type="checkbox"
                                                                               id="form_edit_file_delete"/>
                                    <label className="form-check-label" htmlFor="form_edit_file_delete">Smazat</label>
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

export default AttachmentForm;