import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import EndCustomerForm from "./EndCustomerForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const EndCustomersSelectList = ({onChange, selected}) => {
    const {API} = useRootContext()
    const [endCustomers, setEndCustomers] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadEndCustomers((options)=>{
            if (selected) {
                let selectedValue = options.filter(endCustomerValue => endCustomerValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadEndCustomers(onLoad) {
        API.getData("/endCustomer/list", (endCustomers) => {
            setEndCustomers(endCustomers);

            if (endCustomers && endCustomers.length > 0) {
                const options = [];
                endCustomers.map(endCustomer => {
                    let endCustomerValue = {
                        value: endCustomer.id,
                        label: endCustomer.name,
                        logo: endCustomer.logo ? CONFIG.uploadDir + endCustomer.logo : ""
                    };
                    options.push(endCustomerValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewEndCustomer(endCustomer){
        setIsOpen(false);

        loadEndCustomers((options)=>{
            let selectedValue = options.filter(endCustomerValue => endCustomerValue.value == endCustomer.id);

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
            <div className="input-group">
                <div className={"flex-fill"}>
                    <Select
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

                            <EndCustomerForm handleSave={onNewEndCustomer}/>
                        </div>
                        </div>
                    </div>
            </Modal>
        </>
    );
};

export default EndCustomersSelectList;