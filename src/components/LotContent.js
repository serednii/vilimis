import React from "react";
import DroppableZone from "./DroppableZone";
import { TYPES } from "../constants";
import Item from "./Item";
import Lot from "./Lot";
import styles from "../styles";
import { useContainerContext } from "./ContainerContext";

const LotContent = ({ lot, parents }) => {
  const { container, tree, add } = useContainerContext();
  const items = (tree[lot.id]?.[TYPES.ITEM] || []).map(
    (id) => container[TYPES.ITEM][id]
  );
  const lots = (tree[lot.id]?.[TYPES.LOT] || []).map(
    (id) => container[TYPES.LOT][id]
  );
  const _parents = (parents || []).concat([lot.id]);

  const handleAddItem = () => add(TYPES.ITEM, lot.id);
  const handleAddLot = () => add(TYPES.LOT, lot.id);

  const addLot = (
      <button className="btn btn-secondary gephart-builder-workflow-add" onClick={handleAddLot}>
        <svg className="icon icon-xs me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"
             xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        Událost
      </button>
  );

  return (
    <>
        {/*<DroppableZone
        type={TYPES.ITEM}
        parents={_parents}
        elements={items}
        As={Item}
        style={styles.items}
      />*/}
      <DroppableZone
        type={TYPES.LOT}
        parents={_parents}
        elements={lots}
        addLot={addLot}
        As={Lot}
      />
    </>
  );
};

export default LotContent;
