import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const ProjectStatusesSelectList = ({onChange, selected}) => {
    const {API} = useRootContext()
    const [projectStatuses, setProjectStatuses] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadProjectStatuses((options)=>{
            if (selected) {
                let selectedValue = options.filter(projectStatusValue => projectStatusValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadProjectStatuses(onLoad) {
        API.getData("/projectStatus/list?order=priority", (projectStatuses) => {
            setProjectStatuses(projectStatuses);

            if (projectStatuses && projectStatuses.length > 0) {
                const options = [];
                projectStatuses.map(projectStatus => {
                    let projectStatusValue = {
                        value: projectStatus.id,
                        label: projectStatus.name,
                        color: projectStatus.color
                    };
                    options.push(projectStatusValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }


    const dot = (color = null) => ({
        alignItems: 'center',
        display: 'flex',

        ':before': {
            background: color ? color : "transparent",
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
        singleValue: (styles, {data}) => ({...styles, ...dot(data.color)}),
        option: (styles, {data}) => ({...styles, ...dot(data.color)}),
    }


    function handleChange(value) {
        setSelectedOption(value);
        if (onChange) {
            onChange(value.value);
        }
    }

    return (
        <>
            <Select
                className="react-select-container"
                classNamePrefix="react-select"
                value={selectedOption}
                onChange={handleChange}
                options={option}
                styles={colourStyles}
            />
        </>
    );
};

export default ProjectStatusesSelectList;