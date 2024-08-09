import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import CostFormModal from "./CostFormModal";

const CostsSelectList = ({onChange, selected, license}) => {
    const {API} = useRootContext()
    const [costs, setCosts] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadCosts((options)=>{
            if (selected) {
                let selectedValue = options.filter(costValue => costValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadCosts(onLoad) {
        API.getData("/cost/list?order=day_of_accounting%20DESC", (costs) => {
            setCosts(costs);

            if (costs && costs.length > 0) {
                const options = [];
                costs.map(cost => {
                    let name = cost.name;
                    if (cost.dayOfAccounting) {
                        name += " - " + cost.dayOfAccounting.date.substring(0, 10);
                    }
                    let costValue = {
                        value: cost.id,
                        label: name
                    };
                    options.push(costValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewCost(cost){
        setIsOpen(false);

        loadCosts((options)=>{
            let selectedValue = options.filter(costValue => costValue.value == cost.id);

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
                <CostFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    callback={onNewCost}
                    license={license}
                    />
            )}
        </>
    );
};

export default CostsSelectList;