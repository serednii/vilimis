import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import ClientContactFormModal from "./ClientContactFormModal";

const ClientContactsSelectList = ({onChange, selected, multiple, clientId}) => {
    const {API} = useRootContext()
    const [clientContacts, setClientContacts] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedIds, setSelectedIds] = useState();
    const [option, setOption] = useState([]);
    const [reload, setReload] = useState(0);

    useEffect(()=>{
        setSelectedIds(structuredClone(selected));
    }, [selected])

    useEffect(() => {
        loadClientContacts((options)=>{
            if (selectedIds && Array.isArray(selectedIds)) {
                let selectedValues = [];
                let selectedValuesIds = [];
                selectedIds.forEach(selectedSingle=>{
                    let selectedValue = options.filter(clientContactValue => clientContactValue.value == selectedSingle);
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
                let selectedValue = options.filter(clientContactValue => clientContactValue.value == selectedIds);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, [selectedIds, clientId, reload]);

    function loadClientContacts(onLoad) {
        let url = "/clientContact/list";
        if (clientId) {
            url += "?filter[client_id]="+clientId;
        }
        API.getData(url, (clientContacts) => {
            setClientContacts(clientContacts);

            const options = [];

            if (clientContacts && clientContacts.length > 0) {
                clientContacts.map(clientContact => {
                    let clientContactValue = {
                        value: parseInt(clientContact.id),
                        label: clientContact.name + " " + clientContact.surname + (clientContact.position ? " ("+clientContact.position+")" : ""),
                        logo: clientContact.photo ? CONFIG.uploadDir + clientContact.photo : ""
                    };
                    options.push(clientContactValue);
                });
            }

            setOption(options);

            if (onLoad) {
                onLoad(options);
            }
        });
    }

    function onNewClientContact(clientContact){
        setIsOpen(false);

        selectedIds.push(clientContact.id);
        setSelectedIds(selectedIds);

        if (onChange) {
            onChange(selectedIds);
        }

        console.log(selectedIds)

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
        }: {},
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
                <ClientContactFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    callback={onNewClientContact}
                    clientId={clientId}
                />
            )}
        </>
    );
};

export default ClientContactsSelectList;