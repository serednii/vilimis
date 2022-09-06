import React from "react";
import DraggableElement from "../DraggableElement";
import LotContent from "../LotContent";
import {TYPES} from "../../constants";
import styles from "../../styles";
import {useContainerContext} from "../ContainerContext";

const Edit = ({data, index, parents, addLot}) => {
    const {remove} = useContainerContext();
    const handleRemove = () => remove(TYPES.LOT, data.id);

    return (
        <DraggableElement
            type={TYPES.LOT}
            id={data.id}
            index={index}
            parents={parents}
            className="gephart-builder-workflow-item-wrap"
        >
                <div className="gephart-builder-workflow-item">

                    <div className="gephart-builder-workflow-item-icon">
                        <div className="gephart-builder-workflow-item-round"><span></span><span></span><span></span>
                        </div>
                        <div className="gephart-builder-workflow-item-inner">
                            <img src="gephart/icons/edit-1.svg" width="30px" height="30px"/><br/>
                            Změna
                        </div>
                    </div>
                    <div className="gephart-builder-workflow-item-text">
                        <h2 className={"h5"}>{data.title}</h2>
                        {data.text && (
                        <p dangerouslySetInnerHTML={{__html: data.text}} />
                        )}
                        <button onClick={handleRemove}>Remove</button>
                        {addLot && addLot}
                    </div>
                </div>
                <LotContent lot={data} parents={parents}/>
        </DraggableElement>
    );
};

export default Edit;
