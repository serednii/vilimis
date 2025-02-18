import React from "react";
import DraggableElement from "./DraggableElement";
import LotContent from "./LotContent";
import {TYPES} from "../../constants";
import styles from "../../styles";
import {useContainerContext} from "./ContainerContext";

const Lot = ({data, index, parents}) => {
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
                        <div className="gephart-builder-workflow-item-hexagon"><span></span><span></span><span></span>
                        </div>
                        <div className="gephart-builder-workflow-item-inner">
                            <img src="icons/box.svg" width="30px" height="30px"/><br/>
                            Entita
                        </div>
                    </div>
                    <div className="gephart-builder-workflow-item-text">
                        <h2 className={"h5"}>{data.title}</h2>
                        {data.text && (
                        <p dangerouslySetInnerHTML={{__html: data.text}} />
                        )}
                        <button onClick={handleRemove}>Remove</button>
                    </div>
                </div>
                <LotContent lot={data} parents={parents}/>
        </DraggableElement>
    );
};

export default Lot;
