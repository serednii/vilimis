import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import EndCustomerContactForm from "./EndCustomerContactForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const EndCustomerContactsSelectList = ({onChange, selected, multiple, endCustomerId}) => {
    const {API} = useRootContext()
    const [endCustomerContacts, setEndCustomerContacts] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadEndCustomerContacts((options)=>{
            if (selected && Array.isArray(selected)) {
                let selectedValues = [];
                let selectedValuesIds = [];
                selected.forEach(selectedSingle=>{
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
            } else if (selected) {
                let selectedValue = options.filter(endCustomerContactValue => endCustomerContactValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, [selected, endCustomerId]);

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
                        logo: endCustomerContact.logo ? CONFIG.uploadDir + endCustomerContact.logo : ""
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

        loadEndCustomerContacts();
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
        let values = [];
        if (value && "0" in value) {
            value.forEach((v) => {
                values.push(v.value);
            });
            setSelectedOption(value);
            if (onChange) {
                onChange(values);
            }
            return;
        }

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
                            <h2>Nový koncový zákazník</h2>

                            <EndCustomerContactForm endCustomerId={endCustomerId} handleSave={onNewEndCustomerContact}/>
                        </div>
                        </div>
                    </div>
            </Modal>
        </>
    );
};

export default EndCustomerContactsSelectList;