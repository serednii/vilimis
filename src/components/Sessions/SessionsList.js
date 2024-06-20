import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import SessionFormModal from "./SessionFormModal";

const SessionsList = ({projectId}) => {
    const {API} = useRootContext()
    const [sessions, setSessions] = useState([]);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalSessionId, setModalSessionId] = React.useState(0);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(() => {
        loadSessions();
    }, [projectId]);

    function handleDelete(id) {
        API.getData("/session/delete/"+id, ()=>{
            loadSessions();
        });
    }

    function handleUpdate()
    {
        loadSessions();
    }
    function loadSessions() {
        let url = "/session/list";

        url += "?order=datetime_of_session DESC"
        if (projectId) {
            url += "&filter[project_id]="+encodeURIComponent(projectId);
        }

        API.getData(url, (sessions) => {
            setSessions(sessions);
        });
    }

    return (
        <>
            <div className="my-3">
                <button onClick={() => {
                    setModalSessionId(null);
                    setIsOpen(true)
                }} className="btn btn-primary" type="button">Nové setkání</button>
            </div>

            <div className="list-group list-group-flush list-group-timeline">
                {sessions && sessions.length > 0 && sessions.map((session, session_key) => (
                    <div role="presentation" onClick={() => {
                        setModalSessionId(session.id);
                        setIsOpen(true)
                    }}   className={"cursor-pointer list-group-item border-0 c "+(!!session.done && "list-group-item--done list-group-item--stripe")} key={session_key}>
                        <div className="fw-bold">
                            {session.name}
                        </div>
                        <div>
                            {session && "date" in session && session.date && "date" in session.date && (
                                <small>
                                {(new Date(session.date.date)).toLocaleDateString()}
                                </small>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {modalIsOpen && (
                <SessionFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    setIsOpen={setIsOpen}
                    callback={handleUpdate}
                    projectId={projectId}
                    id={modalSessionId}/>
            )}
        </>
    );
};

export default SessionsList;