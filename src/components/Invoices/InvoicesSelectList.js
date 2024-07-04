import React, { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import Select from "react-select";
import { CONFIG } from "../../config";
import InvoiceForm from "./InvoiceForm";
import Modal from 'react-modal';

Modal.setAppElement("#root");

const InvoicesSelectList = ({ onChange, selected, projectId, onNew }) => {
    const { API } = useRootContext();
    const [invoices, setInvoices] = useState([]);
    const [projects, setProjects] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        let loadInvoiceCallback = (projects) => loadInvoices((options) => {
            if (selected) {
                let selectedValue = options.filter(invoiceValue => invoiceValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        }, projects);

        if (projectId) {
            loadInvoiceCallback();
        } else {
            loadProjects(loadInvoiceCallback);
        }
    }, []);
    function loadProjects(onLoad) {
        API.getData("/project/list", (projects) => {
            setProjects(projects);
            if (onLoad) {
                onLoad(projects); // stav setProjects se jen při prvním nastavení přese do onLoad, takže předávám jako parametr
            }
        });
    }

    function loadInvoices(onLoad, projects) {
        API.getData("/invoice/list", (invoices) => {
            if (projectId) {
                invoices = invoices.filter(invoice=>(invoice.projectId == projectId));
            }
            setInvoices(invoices);

            if (invoices && invoices.length > 0) {
                const options = [];
                invoices.map(invoice => {
                    let label = invoice.name;

                    if (!projectId && projects && projects.length > 0) {
                        projects.filter(project=>project.id==invoice.projectId).forEach(project=> {
                            label = `
                                `+invoice.name+`<br/>
                                <small>`+project.name+`</small>
                            `;
                        })
                    }

                    let invoiceValue = {
                        value: invoice.id,
                        label: label,
                        logo: invoice.logo ? CONFIG.uploadDir + invoice.logo : ""
                    };
                    options.push(invoiceValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewInvoice(invoice) {
        setIsOpen(false);

        loadInvoices((options) => {
            let selectedValue = options.filter(invoiceValue => invoiceValue.value == invoice.id);

            if (selectedValue) {
                setSelectedOption(selectedValue[0])
                if (onChange) {
                    onChange(selectedValue[0].value);
                }
            }

            if (onNew) {
                onNew();
            }
        });
    }

    const colourStyles = {
        input: (styles) => ({ ...styles }),
        singleValue: (styles, { data }) => ({ ...styles }),
        option: (styles, { data }) => ({ ...styles }),
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
                        value={selectedOption}
                        onChange={handleChange}
                        isSearchable={true}
                        options={option}
                        styles={colourStyles}
                        formatOptionLabel={function(data) {
                            return (
                                <span dangerouslySetInnerHTML={{ __html: data.label }} />
                            );
                        }}
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
                            <h2>Invoice</h2>

                            <InvoiceForm handleSave={onNewInvoice} />
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default InvoicesSelectList;