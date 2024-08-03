import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const SessionTypesSelectList = ({onChange, selected}) => {
    const {API} = useRootContext()
    const [sessionTypes, setSessionTypes] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadSessionTypes((options)=>{
            if (selected) {
                let selectedValue = options.filter(sessionTypeValue => sessionTypeValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadSessionTypes(onLoad) {
        API.getData("/sessionType/list", (sessionTypes) => {
            setSessionTypes(sessionTypes);

            if (sessionTypes && sessionTypes.length > 0) {
                const options = [];
                sessionTypes.map(sessionType => {
                    let sessionTypeValue = {
                        value: sessionType.id,
                        label: sessionType.name,
                        color: sessionType.color
                    };
                    options.push(sessionTypeValue);
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
                placeholder={"Vybrat"}
                className="react-select-container"
                classNamePrefix="react-select"
                value={selectedOption}
                onChange={handleChange}
                isSearchable={true}
                menuPosition="fixed"
                options={option}
                styles={colourStyles}
            />
        </>
    );
};

export default SessionTypesSelectList;