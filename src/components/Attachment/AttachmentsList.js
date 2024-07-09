import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import { NavLink } from "react-router-dom";
import AttachmentFormModal from "./AttachmentFormModal";
import { CONFIG } from "../../config";

const AttachmentsList = ({ entity, entityId }) => {
    const { API } = useRootContext()
    const [attachments, setAttachments] = useState([]);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalAttachmentId, setModalAttachmentId] = React.useState(0);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        loadAttachments();
    }, [entity, entityId]);

    function handleDelete(id) {
        API.getData("/attachment/delete/" + id, () => {
            loadAttachments();
        });
    }

    function handleUpdate() {
        loadAttachments();
    }
    function loadAttachments() {
        let url = "/attachment/list";
        if (entity || entityId) {
            url += "?"
            if (entity) {
                url += "&filter[entity]=" + encodeURIComponent(entity);
            }
            if (entityId) {
                url += "&filter[entity_id]=" + encodeURIComponent(entityId);
            }
        }
        API.getData(url, (attachments) => {
            setAttachments(attachments);
        });
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Přílohy</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setModalAttachmentId(null);
                    setIsOpen(true)
                }} className="btn btn-primary" type="button">Nová příloha</button>
            </div>

            {attachments?.length > 0 ? (
                <div className="card border-0 shadow mb-4">
                    <div className="card-body">
                        <div className="table-responsive">
                            <table className="table table-centered table-nowrap mb-0 rounded">
                                <thead className="thead-light">
                                <tr>
                                    <th className="border-0 rounded-start">#</th>
                                    <th className="border-0">Název</th>
                                    <th className="border-0">Soubor</th>
                                    <th className="border-0">Vytvořeno</th>
                                    <th className="border-0 rounded-end">Akce</th>
                                </tr>
                                </thead>
                                <tbody>
                                {attachments?.length > 0 && attachments.map((attachment, attachment_key) => (
                                    <tr key={attachment_key}>
                                        <td>
                                            <span role="presentation" onClick={() => {
                                                setModalAttachmentId(attachment.id);
                                                setIsOpen(true)
                                            }} className="text-primary fw-bold cursor-pointer">
                                                {attachment.id}
                                            </span>
                                        </td>
                                        <td className="fw-bold ">
                                            {attachment.name}
                                        </td>
                                        <td>
                                            <a target="_blank" href={CONFIG.uploadDir + attachment.file}>{attachment.file}</a>
                                        </td>
                                        <td> {attachment.created.date}</td>
                                        <td>
                                            <button onClick={() => {
                                                setModalAttachmentId(attachment.id);
                                                setIsOpen(true)
                                            }} className="btn btn-sm btn-primary" type="button">Upravit</button>
                                            <button
                                                onClick={() => window.confirm("Opravdu smazat?") && handleDelete(attachment.id)}
                                                className="btn btn-sm btn-danger" type="button">Smazat</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <p>Žádná příloha.</p>
            )}

            {modalIsOpen && (
                <AttachmentFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={handleUpdate}
                    entity={entity}
                    entityId={entityId}
                    id={modalAttachmentId} />
            )}
        </>
    );
};

export default AttachmentsList;