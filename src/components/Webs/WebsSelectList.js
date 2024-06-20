import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import Select from "react-select";
import { CONFIG } from "../../config";
import WebForm from "./WebForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const WebsSelectList = ({ onChange, selected, projectId, onNew }) => {
    const { API } = useRootContext();
    const [webs, setWebs] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        let loadWebCallback = (projects) => loadWebs((options) => {
            if (selected) {
                let selectedValue = options.filter(webValue => webValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        }, projects);

        if (projectId) {
            loadWebCallback();
        } else {
            loadProjects(loadWebCallback);
        }
    }, []);
    function loadProjects(onLoad) {
        API.getData("/project/list", (projects) => {
            setProjects(projects);
            if (onLoad) {
                onLoad(projects); // stav setProjects se jen při prvním nastavení přese do onLoad, takže předávám jako parametr
            }
        });
    }

    function loadWebs(onLoad, projects) {
        API.getData("/web/list", (webs) => {
            if (projectId) {
                webs = webs.filter(web=>(web.projectId == projectId));
            }
            setWebs(webs);

            if (webs && webs.length > 0) {
                const options = [];
                webs.map(web => {
                    let label = web.name;

                    if (!projectId && projects && projects.length > 0) {
                        projects.filter(project=>project.id==web.projectId).forEach(project=> {
                            label = `
                                `+web.name+`<br/>
                                <small>`+project.name+`</small>
                            `;
                        })
                    }

                    let webValue = {
                        value: web.id,
                        label: label,
                        logo: web.logo ? CONFIG.uploadDir + web.logo : ""
                    };
                    options.push(webValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewWeb(web) {
        setIsOpen(false);

        loadWebs((options) => {
            let selectedValue = options.filter(webValue => webValue.value == web.id);

            if (selectedValue) {
                setSelectedOption(selectedValue[0])
                if (onChange) {
                    onChange(selectedValue[0].value);
                }
            }

            if (onNew) {
                onNew();
            }
        });
    }

    const colourStyles = {
        input: (styles) => ({ ...styles }),
        singleValue: (styles, { data }) => ({ ...styles }),
        option: (styles, { data }) => ({ ...styles }),
    }


    function handleChange(value) {
        setSelectedOption(value);
        if (onChange) {
            onChange(value.value);
        }
    }




    const [modalIsOpen, setIsOpen] = React.useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
    }

    return (
        <>
            <div className="d-flex">
                <div className={"flex-fill"}>
                    <Select
                        placeholder={"Vybrat"}
                        value={selectedOption}
                        onChange={handleChange}
                        isSearchable={true}
                        options={option}
                        styles={colourStyles}
                        formatOptionLabel={function(data) {
                            return (
                                <span dangerouslySetInnerHTML={{ __html: data.label }} />
                            );
                        }}
                    />
                </div>
                <div className="ps-3">
                    <button onClick={openModal} type="button" className="btn btn-primary">+</button>
                </div>
            </div>


            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                contentLabel="Example Modal"
                className="modalccc"
                overlayClassName="modal-dialogccc"
            >
                <div className="modal-content">
                    <div className="modal-body p-0">
                        <div className="card p-3 p-lg-4">
                            <button onClick={closeModal} type="button" className="btn-close ms-auto" data-bs-dismiss="modal"
                                aria-label="Close"></button>
                            <h2>Web</h2>

                            <WebForm handleSave={onNewWeb} />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default WebsSelectList;