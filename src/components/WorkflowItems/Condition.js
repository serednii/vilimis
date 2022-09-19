import React from "react";
import DraggableElement from "../Workflow/DraggableElement";
import LotContent from "../Workflow/LotContent";
import {TYPES} from "../../constants";
import styles from "../../styles";
import {useContainerContext} from "../Workflow/ContainerContext";

const Condition = ({data, index, parents, addLot}) => {
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
                        <div className="gephart-builder-workflow-item-rhombus"><span></span><span></span><span></span>
                        </div>
                        <div className="gephart-builder-workflow-item-inner">
                            <img src="gephart/icons/corner-down-right.svg" width="30px" height="30px"/><br/>
                            Událost
                        </div>
                    </div>
                    <div className="gephart-builder-workflow-item-text">
                        <h2 className={"h5"}>{data.title}</h2>
                        {data.text && (
                        <p dangerouslySetInnerHTML={{__html: data.text}} />
                        )}
                        <button onClick={handleRemove}>Remove</button>
                    </div>

                    {addLot}
                </div>
                <LotContent lot={data} parents={parents}/>
        </DraggableElement>
    );
};

export default Condition;
