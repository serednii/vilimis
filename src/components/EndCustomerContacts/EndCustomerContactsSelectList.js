import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import EndCustomerContactFormModal from "./EndCustomerContactFormModal";

const EndCustomerContactsSelectList = ({onChange, selected, multiple, endCustomerId}) => {
    const {API} = useRootContext()
    const [endCustomerContacts, setEndCustomerContacts] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedIds, setSelectedIds] = useState(selected);
    const [option, setOption] = useState([]);
    const [reload, setReload] = useState(0);

    useEffect(()=>{
        setSelectedIds(structuredClone(selected));
    }, [selected])

    useEffect(() => {
        loadEndCustomerContacts((options)=>{
            if (selectedIds && Array.isArray(selectedIds)) {
                let selectedValues = [];
                let selectedValuesIds = [];
                selectedIds.forEach(selectedSingle=>{
                    let selectedValue = options.filter(endCustomerContactValue => endCustomerContactValue.value == selectedSingle);
                    if (selectedValue && selectedValue[0]) {
                        selectedValues.push(selectedValue[0]);
                        selectedValuesIds.push(selectedValue[0].value);
                    }
                })

                if (selectedValues.length > 0) {
                    setSelectedOption(selectedValues);
                }
                if (onChange) {
                    onChange(selectedValuesIds);
                }
            } else if (selectedIds) {
                let selectedValue = options.filter(endCustomerContactValue => endCustomerContactValue.value == selectedIds);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, [endCustomerId, selectedIds, reload]);

    function loadEndCustomerContacts(onLoad) {
        let url = "/endCustomerContact/list";
        if (endCustomerId) {
            url += "?filter[end_customer_id]="+endCustomerId;
        }
        API.getData(url, (endCustomerContacts) => {
            setEndCustomerContacts(endCustomerContacts);

            const options = [];

            if (endCustomerContacts && endCustomerContacts.length > 0) {
                endCustomerContacts.map(endCustomerContact => {
                    let endCustomerContactValue = {
                        value: parseInt(endCustomerContact.id),
                        label: endCustomerContact.name + " " + endCustomerContact.surname + (endCustomerContact.position ? " ("+endCustomerContact.position+")" : ""),
                        logo: endCustomerContact.photo ? CONFIG.uploadDir + endCustomerContact.photo : ""
                    };
                    options.push(endCustomerContactValue);
                });
            }

            setOption(options);

            if (onLoad) {
                onLoad(options);
            }
        });
    }

    function onNewEndCustomerContact(endCustomerContact){
        setIsOpen(false);

        selectedIds.push(endCustomerContact.id);
        setSelectedIds(selectedIds);

        if (onChange) {
            onChange(selectedIds);
        }

        setReload((prev) => prev + 1);
    }


    const dot = (logo = null) => ({
        alignItems: 'center',
        display: 'flex',

        ':before': logo ? {
            background: logo ? "url('" + logo + "') no-repeat center center / contain" : "transparent",
            borderRadius: 3,
            content: '" "',
            display: 'block',
            marginRight: 8,
            height: 20,
            width: 20,
        } : {},
    });

    const colourStyles = {
        input: (styles) => ({...styles, ...dot()}),
        singleValue: (styles, {data}) => ({...styles, ...dot(data.logo)}),
        multiValue: (styles, {data}) => ({...styles, ...dot(data.logo)}),
        option: (styles, {data}) => ({...styles, ...dot(data.logo)}),
    }


    function handleChange(value) {
        let values = [];
        if (value && "0" in value) {
            value.forEach((v) => {
                values.push(v.value);
            });
            setSelectedOption(value);
            setSelectedIds(values);
            if (onChange) {
                onChange(values);
            }
            return;
        }

        setSelectedOption(value);
        setSelectedIds(value.value);

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
                <div className="flex-fill">
                    <Select
                        value={selectedOption}
                        onChange={handleChange}
                        options={option}
                        styles={colourStyles}
                        isMulti={multiple}
                    />
                </div>
                <div className="ps-3">
                    <button onClick={openModal} type="button" className="btn btn-primary">+</button>
                </div>
            </div>

            {modalIsOpen && (
                <EndCustomerContactFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    callback={onNewEndCustomerContact}
                    endCustomerId={endCustomerId}
                />
            )}
        </>
    );
};

export default EndCustomerContactsSelectList;