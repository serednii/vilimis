import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import CommentFormModal from "./CommentFormModal";

const CommentsList = ({entity, entityId}) => {
    const {API} = useRootContext()
    const [comments, setComments] = useState([]);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalCommentId, setModalCommentId] = React.useState(0);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        loadComments();
    }, [entity, entityId]);

    function handleDelete(id) {
        API.getData("/comment/delete/"+id, ()=>{
            loadComments();
        });
    }

    function handleUpdate()
    {
        loadComments();
    }
    function loadComments() {
        let url = "/comment/list";
        if (entity || entityId) {
            url += "?"
            if (entity) {
                url += "&filter[entity]="+encodeURIComponent(entity);
            }
            if (entityId) {
                url += "&filter[entity_id]="+encodeURIComponent(entityId);
            }
        }
        API.getData(url, (comments) => {
            setComments(comments);
        });
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Poznámky</h1></div>
            </div>

            <div className="my-3">
                <button onClick={() => {
                    setModalCommentId(null);
                    setIsOpen(true)
                }} className="btn btn-primary" type="button">Nová poznámka</button>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-centered table-nowrap mb-0 rounded">
                            <thead className="thead-light">
                            <tr>
                                <th className="border-0 rounded-start">#</th>
                                <th className="border-0">Název</th>
                                <th className="border-0">Vytvořeno</th>
                                <th className="border-0 rounded-end">Akce</th>
                            </tr>
                            </thead>
                            <tbody>
                            {comments && comments.length > 0 && comments.map((comment, comment_key) => (
                                <tr key={comment_key}>
                                    <td>
                                        <NavLink to={"/comments/edit/"+comment.id} className="text-primary fw-bold">
                                            {comment.id}
                                        </NavLink>
                                    </td>
                                    <td className="fw-bold ">
                                        <div dangerouslySetInnerHTML={{__html:comment.description}}></div>
                                    </td>
                                    <td> {comment.created.date}</td>
                                    <td>
                                        <button onClick={() => {
                                            setModalCommentId(comment.id);
                                            setIsOpen(true)
                                        }}  className="btn btn-sm btn-primary" type="button">Upravit</button>
                                        <button
                                            onClick={()=> window.confirm("Opravdu smazat?") && handleDelete(comment.id)}
                                            className="btn btn-sm btn-danger" type="button">Smazat</button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {modalIsOpen && (
                <CommentFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={handleUpdate}
                    entity={entity}
                    entityId={entityId}
                    id={modalCommentId}/>
            )}
        </>
    );
};

export default CommentsList;