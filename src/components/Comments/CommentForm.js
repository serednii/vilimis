import React, {useEffect, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {CONFIG} from "../../config";
import JoditEditor from "jodit-react";

const commentBlank = {
    description: "",
}

const CommentForm = ({id, handleSave, entity, entityId}) => {
    const {API} = useRootContext()
    const [comment, setComment] = useState(null);

    const editor = useRef(null);
    const [content, setContent] = useState('');

    useEffect(() => {
        if (id) {
            API.getData("/comment/single/" + id, (data) => {
                setContent(data.description);
                setComment(data);
            });
        } else {
            setContent("");
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
                        <input type="hidden" name="description" value={content}/>

                        <JoditEditor
                            ref={editor}
                            value={content}
                            config={{...CONFIG.joedit}}
                            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                            onChange={newContent => {
                            }}
                        />
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