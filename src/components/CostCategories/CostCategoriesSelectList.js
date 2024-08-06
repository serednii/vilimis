import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import Select from "react-select";
import {CONFIG} from "../../config";
import CostCategoryFormModal from "./CostCategoryFormModal";

const CostCategoriesSelectList = ({onChange, selected}) => {
    const {API} = useRootContext()
    const [costCategories, setCostCategories] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [option, setOption] = useState([]);

    useEffect(() => {
        loadCostCategories((options)=>{
            if (selected) {
                let selectedValue = options.filter(costCategoryValue => costCategoryValue.value == selected);
                if (selectedValue) {
                    setSelectedOption(selectedValue[0])
                    if (onChange) {
                        onChange(selectedValue[0].value);
                    }
                }
            }
        });
    }, []);

    function loadCostCategories(onLoad) {
        API.getData("/costCategory/list", (costCategories) => {
            setCostCategories(costCategories);

            if (costCategories && costCategories.length > 0) {
                const options = [];
                costCategories.map(costCategory => {
                    let costCategoryValue = {
                        value: costCategory.id,
                        label: costCategory.name,
                        color: costCategory.color
                    };
                    options.push(costCategoryValue);
                });
                setOption(options);

                if (onLoad) {
                    onLoad(options);
                }
            }
        });
    }

    function onNewCostCategory(costCategory){
        setIsOpen(false);

        loadCostCategories((options)=>{
            let selectedValue = options.filter(costCategoryValue => costCategoryValue.value == costCategory.id);

            if (selectedValue) {
                setSelectedOption(selectedValue[0])
                if (onChange) {
                    onChange(selectedValue[0].value);
                }
            }
        });
    }


    const dot = (color = null) => ({
        alignItems: 'center',
        display: 'flex',

        ':before': {
            background: color ? color : "transparent",
            borderRadius: 3,
            content: '" "',
            display: 'block',
            marginRight: 8,
            height: 20,
            width: 20,
        },
    });

    const colourStyles = {
        input: (styles) => ({...styles, ...dot()}),
        singleValue: (styles, {data}) => ({...styles, ...dot(data.color)}),
        option: (styles, {data}) => ({...styles, ...dot(data.color)}),
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
                <CostCategoryFormModal
                    isOpen={modalIsOpen}
                    onAfterOpen={afterOpenModal}
                    onRequestClose={closeModal}
                    callback={onNewCostCategory}
                    />
            )}
        </>
    );
};

export default CostCategoriesSelectList;