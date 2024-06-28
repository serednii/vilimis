import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import Select from "react-select";
import { CONFIG } from "../../config";
import TaskForm from "./TaskForm";
import Modal from 'react-modal';
import TaskFormModal from "./TaskFormModal";

Modal.setAppElement("#root");

const TasksSelectList = ({ onChange, selected, projectId, onNew }) => {
    const { API } = useRootContext();
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        let loadTaskCallback = (projects) => loadTasks((options) => {
            if (selected) {
                let selectedValue = options.filter(taskValue => taskValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        }, projects);

        if (projectId) {
            loadTaskCallback();
        } else {
            loadProjects(loadTaskCallback);
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

    function loadTasks(onLoad, projects) {
        API.getData("/task/list", (tasks) => {
            if (projectId) {
                tasks = tasks.filter(task=>(task.projectId == projectId));
            }
            setTasks(tasks);

            if (tasks && tasks.length > 0) {
                const options = [];
                tasks.map(task => {
                    let label = task.name;

                    if (!projectId && projects && projects.length > 0) {
                        projects.filter(project=>project.id==task.projectId).forEach(project=> {
                            label = `
                                `+task.name+`<br/>
                                <small>`+project.name+`</small>
                            `;
                        })
                    }

                    let taskValue = {
                        value: task.id,
                        label: label,
                        logo: task.logo ? CONFIG.uploadDir + task.logo : ""
                    };
                    options.push(taskValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewTask(task) {
        setIsOpen(false);

        loadTasks((options) => {
            let selectedValue = options.filter(taskValue => taskValue.value == task.id);

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


            {
                modalIsOpen && (
                    <TaskFormModal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        setIsOpen={setIsOpen}
                        callback={onNewTask}
                        />
                )
            }
        </>
    );
};

export default TasksSelectList;