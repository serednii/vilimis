import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import EndCustomerForm from "./EndCustomerForm";
import EndCustomerFormModal from "./EndCustomerFormModal";

const EndCustomersSelectList = ({onChange, selected, clientId}) => {
    const {API} = useRootContext()
    const [endCustomers, setEndCustomers] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadEndCustomers((options)=>{
            if (selected) {
                let selectedValue = options.filter(endCustomerValue => endCustomerValue.value == selected);
                if (selectedValue && selectedValue[0]) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, [clientId]);

    function loadEndCustomers(onLoad) {
        API.getData("/endCustomer/list", (endCustomers) => {
            if (clientId) {
                endCustomers = endCustomers?.filter(endCustomer=>(endCustomer.clientId == clientId));
            }

            setEndCustomers(endCustomers);

            if (endCustomers?.length > 0) {
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
            } else {
                setOption([]);
                onLoad([]);
            }
        });
    }

    function onNewEndCustomer(endCustomer){
        setIsOpen(false);

        loadEndCustomers((options)=>{
            let selectedValue = options.filter(endCustomerValue => endCustomerValue.value  == endCustomer.id);

            if (selectedValue && selectedValue[0]) {
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
                </div>
                <div className="ps-3">
                    <button onClick={openModal} type="button" className="btn btn-primary">+</button>
                </div>
            </div>


            {modalIsOpen && (
                <EndCustomerFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    callback={onNewEndCustomer}
                    clientId={clientId}
                />
            )}
        </>
    );
};

export default EndCustomersSelectList;