import React from "react";
import DraggableElement from "./DraggableElement";
import { TYPES } from "../../constants";
import styles from "../../styles";
import { useContainerContext } from "./ContainerContext";

const Item = ({ data, index, parents }) => {
  const { remove } = useContainerContext();
  const handleRemove = () => remove(TYPES.ITEM, data.id);

  return (
    <DraggableElement
      type={TYPES.ITEM}
      id={data.id}
      index={index}
      parents={parents}
      style={{...styles.item, display:"inline-block"}}
    >
      {data.title}
      <button onClick={handleRemove}>Remove</button>
    </DraggableElement>
  );
};

export default Item;
