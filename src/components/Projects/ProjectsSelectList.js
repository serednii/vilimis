import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import ProjectFormModal from "./ProjectFormModal";


const ProjectsSelectList = ({onChange, selected}) => {
    const {API} = useRootContext()
    const [projects, setProjects] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadProjects((options)=>{
            if (selected) {
                let selectedValue = options.filter(projectValue => projectValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadProjects(onLoad) {
        API.getData("/project/list", (projects) => {
            setProjects(projects);

            if (projects && projects.length > 0) {
                const options = [];
                projects.map(project => {
                    let projectValue = {
                        value: project.id,
                        label: project.name,
                        logo: project.logo ? CONFIG.uploadDir + project.logo : ""
                    };
                    options.push(projectValue);
                });

                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewProject(project){
        setIsOpen(false);

        loadProjects((options)=>{
            let selectedValue = options.filter(projectValue => projectValue.value == project.id);

            if (selectedValue) {
                setSelectedOption(selectedValue[0])
                if (onChange) {
                    onChange(selectedValue[0].value);
                }
            }
        });
    }


    const dot = (logo = null) => ({
        alignItems: 'center',
        display: 'flex',

        ':before': {
            background: logo ? "url('" + logo + "') no-repeat center center / contain" : "transparent",
            borderRadius: 3,
            content: '" "',
            display: 'block',
            marginRight: 8,
            height: 20,
            width: 40,
        },
    });

    const colourStyles = {
        input: (styles) => ({...styles, ...dot()}),
        singleValue: (styles, {data}) => ({...styles, ...dot(data.logo)}),
        option: (styles, {data}) => ({...styles, ...dot(data.logo)}),
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
                        className="react-select-container"
                        classNamePrefix="react-select"
                        value={selectedOption}
                        onChange={handleChange}
                        options={option}
                        styles={colourStyles}
                    />
                </div>
                <div className="ps-3">
                    <button onClick={openModal} type="button" className="btn btn-primary">+</button>
                </div>
            </div>


            {
                modalIsOpen && (
                    <ProjectFormModal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        setIsOpen={setIsOpen}
                        callback={onNewProject}
                    />
                )
            }
        </>
    );
};

export default ProjectsSelectList;