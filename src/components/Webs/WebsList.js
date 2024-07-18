import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import { NavLink } from "react-router-dom";

const WebsList = ({ }) => {
    const { API } = useRootContext()
    const [webs, setWebs] = useState([]);
    const [websLoading, setWebsLoading] = useState(false);

    useEffect(() => {
        setWebsLoading(true);
        API.getData("/web/list", (webs) => {
            setWebs(webs);
            setWebsLoading(false);
        });
    }, []);

    function handleDelete(id) {
        API.getData("/web/delete/" + id, () => {
            API.getData("/web/list", (webs) => {
                setWebs(webs);
            });
        });
    }

    if (websLoading) {
        return ("Načítání...");
    }

    return (
        <>
            <div className="d-flex justify-content-between w-100 flex-wrap">
                <div className="mb-3 mb-lg-0"><h1 className="h4">Weby</h1></div>
            </div>

            <div className="my-3">
                <NavLink to="/webs/new" className="btn btn-primary" type="button">Nový web</NavLink>
            </div>

            <div className="card border-0 shadow mb-4">
                <div className="card-body">
                    {webs && webs.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-centered table-nowrap mb-0 rounded">
                                <thead className="thead-light">
                                <tr>
                                    <th className="border-0 rounded-start">#</th>
                                    <th className="border-0">Název</th>
                                    <th className="border-0">URL</th>
                                    <th className="border-0">Projekt</th>
                                    <th className="border-0 rounded-end">Akce</th>
                                </tr>
                                </thead>
                                <tbody>
                                {webs.map((web, web_key) => (
                                    <tr key={web_key}>
                                        <td><NavLink to={"/webs/edit/" + web.id} className="text-primary fw-bold">{web.id}</NavLink></td>
                                        <td className="fw-bold ">
                                            {web.name}
                                        </td>
                                        <td> {web.url}</td>
                                        <td> {web.projectId}</td>
                                        <td>
                                            <NavLink to={"/webs/edit/" + web.id} className="btn btn-sm btn-primary" type="button">Upravit</NavLink>
                                            <button
                                                onClick={() => window.confirm("Opravdu smazat?") && handleDelete(web.id)}
                                                className="btn btn-sm btn-danger" type="button">Smazat</button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>Zatím žádný web</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default WebsList;