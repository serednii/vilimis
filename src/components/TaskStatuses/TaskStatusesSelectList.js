import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const TaskStatusesSelectList = ({onChange, selected}) => {
    const {API} = useRootContext()
    const [taskStatuses, setTaskStatuses] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadTaskStatuses((options)=>{
            if (selected) {
                let selectedValue = options.filter(taskStatusValue => taskStatusValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadTaskStatuses(onLoad) {
        API.getData("/taskStatus/list?order=priority", (taskStatuses) => {
            setTaskStatuses(taskStatuses);

            if (taskStatuses && taskStatuses.length > 0) {
                const options = [];
                taskStatuses.map(taskStatus => {
                    let taskStatusValue = {
                        value: taskStatus.id,
                        label: taskStatus.name,
                        color: taskStatus.color
                    };
                    options.push(taskStatusValue);
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
            width: 20,
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

export default TaskStatusesSelectList;