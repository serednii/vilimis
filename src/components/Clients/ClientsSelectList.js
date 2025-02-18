import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import ClientFormModal from "./ClientFormModal";

const ClientsSelectList = ({onChange, selected}) => {
    const {API} = useRootContext()
    const [clients, setClients] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadClients((options)=>{
            if (selected) {
                let selectedValue = options.filter(clientValue => clientValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadClients(onLoad) {
        API.getData("/client/list", (clients) => {
            setClients(clients);

            if (clients && clients.length > 0) {
                const options = [{
                    value: "",
                    label: "--- žádný ---",
                    logo: null
                }];
                clients.map(client => {
                    let clientValue = {
                        value: client.id,
                        label: client.name,
                        logo: client.logo ? CONFIG.uploadDir + client.logo : ""
                    };
                    options.push(clientValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewClient(client){
        setIsOpen(false);

        loadClients((options)=>{
            let selectedValue = options.filter(clientValue => clientValue.value == client.id);

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
                <ClientFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    callback={onNewClient}
                    />
            )}
        </>
    );
};

export default ClientsSelectList;