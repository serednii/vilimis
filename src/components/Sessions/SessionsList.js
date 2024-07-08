import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {NavLink} from "react-router-dom";
import SessionFormModal from "./SessionFormModal";
import SessionsListItem from "./SessionsListItem";

const SessionsList = ({projectId, clientId}) => {
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
    }, [projectId, clientId]);

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
        if (clientId) {
            url += "&filter[client_id]="+encodeURIComponent(clientId);
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
                    <SessionsListItem
                        handleUpdate={handleUpdate}
                        session={session}
                    key={session_key}/>
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
                    clientId={clientId}
                    id={modalSessionId}/>
            )}
        </>
    );
};

export default SessionsList;