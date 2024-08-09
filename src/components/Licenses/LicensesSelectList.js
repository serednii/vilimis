import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import LicenseFormModal from "./LicenseFormModal";

const LicensesSelectList = ({onChange, selected}) => {
    const {API} = useRootContext()
    const [licenses, setLicenses] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadLicenses((options)=>{
            if (selected) {
                let selectedValue = options.filter(licenseValue => licenseValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadLicenses(onLoad) {
        API.getData("/license/list", (licenses) => {
            setLicenses(licenses);

            if (licenses && licenses.length > 0) {
                const options = [{
                    value: "",
                    label: "--- žádná ---",
                }];
                licenses.map(license => {
                    let licenseValue = {
                        value: license.id,
                        label: license.name
                    };
                    options.push(licenseValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewLicense(license){
        setIsOpen(false);

        loadLicenses((options)=>{
            let selectedValue = options.filter(licenseValue => licenseValue.value == license.id);

            if (selectedValue) {
                setSelectedOption(selectedValue[0])
                if (onChange) {
                    onChange(selectedValue[0].value);
                }
            }
        });
    }



    const colourStyles = {
        input: (styles) => ({...styles}),
        singleValue: (styles) => ({...styles}),
        option: (styles) => ({...styles}),
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
                        className="react-select-container"
                        classNamePrefix="react-select"
                        value={selectedOption}
                        isSearchable={true}
                        menuPosition="fixed"
                        onChange={handleChange}
                        options={option}
                        styles={colourStyles}
                    />
                </div>
                <div className="ps-3">
                    <button onClick={openModal} type="button" className="btn btn-primary">+</button>
                </div>
            </div>


            {modalIsOpen && (
                <LicenseFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    callback={onNewLicense}
                    />
            )}
        </>
    );
};

export default LicensesSelectList;