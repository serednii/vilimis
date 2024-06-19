import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";

const commentBlank = {
    description: "",
}

const CommentForm = ({id, handleSave, entity, entityId}) => {
    const {API} = useRootContext()
    const [comment, setComment] = useState(null);

    useEffect(() => {
        if (id) {
            API.getData("/comment/single/" + id, (data) => {
                setComment(data);
            });
        } else {
            setComment(commentBlank)
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

        if (id && comment && "created" in comment && comment.created && "date" in comment.created) {
            formData.append("created", comment.created.date);
        } else {
            formData.append("created", (new Date()).toISOString());
        }

        API.postData("/comment/save", formData, (data) => {
            setComment(data.comment);

            if (handleSave) {
                handleSave(data.comment);
            }
        });
    }

    return (
        <>
            {comment && "description" in comment && (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="form_edit_description">Poznámka</label>
                        <textarea defaultValue={comment.description} className="form-control" name="description"
                                  rows="10"
                                  id="form_edit_description"></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">
                        {id ? "Uložit" : "Přidat"}
                    </button>
                </form>
            )}
        </>
    );
};

export default CommentForm;