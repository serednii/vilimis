import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import EndCustomerContactForm from "./EndCustomerContactForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const EndCustomerContactsSelectList = ({onChange, selected, multiple}) => {
    const {API} = useRootContext()
    const [endCustomerContacts, setEndCustomerContacts] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadEndCustomerContacts((options)=>{
            if (selected && Array.isArray(selected)) {
                let selectedValues = [];
                selected.forEach(selectedSingle=>{
                    let selectedValue = options.filter(endCustomerContactValue => endCustomerContactValue.value == selectedSingle);
                    if (selectedValue) {
                        selectedValues.push(selectedValue[0]);
                    }
                })
                console.log("selectedValues")
                console.log(selectedValues)
                if (selectedValues.length > 0) {
                    setSelectedOption(selectedValues);
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
    }, []);

    function loadEndCustomerContacts(onLoad) {
        API.getData("/endCustomerContact/list", (endCustomerContacts) => {
            setEndCustomerContacts(endCustomerContacts);

            if (endCustomerContacts && endCustomerContacts.length > 0) {
                const options = [];
                endCustomerContacts.map(endCustomerContact => {
                    let endCustomerContactValue = {
                        value: endCustomerContact.id,
                        label: endCustomerContact.name,
                        logo: endCustomerContact.logo ? CONFIG.uploadDir + endCustomerContact.logo : ""
                    };
                    options.push(endCustomerContactValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewEndCustomerContact(endCustomerContact){
        setIsOpen(false);

        loadEndCustomerContacts((options)=>{
            let selectedValue = options.filter(endCustomerContactValue => endCustomerContactValue.value == endCustomerContact.id);

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
            <div className="input-group">
                <div className={"flex-fill"}>
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

                            <EndCustomerContactForm handleSave={onNewEndCustomerContact}/>
                        </div>
                        </div>
                    </div>
            </Modal>
        </>
    );
};

export default EndCustomerContactsSelectList;