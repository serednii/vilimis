import React, { useRef, useState } from "react";
import { useDrop } from "react-dnd";
import { TYPES } from "../../constants";
import { useContainerContext } from "./ContainerContext";
import { heightBetweenCursorAndMiddle } from "../../utils";
import Condition from "../WorkflowItems/Condition";
import Edit from "../WorkflowItems/Edit";
import Mail from "../WorkflowItems/Mail";
import Entity from "../WorkflowItems/Entity";
import Base from "../WorkflowItems/Base";

const DroppableZone = ({ type, parents, elements, addLot, As, ...props }) => {
  const refDrop = useRef(null);
  const { move, find } = useContainerContext();
  let [isTop, setIsTop] = useState(false);
  let [isDown, setIsDown] = useState(false);

  const [{isOver, canDrop, isOverCurrent}, drop] = useDrop({
    accept: type,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
    drop: (element, monitor) => {
      setIsTop(false);
      setIsDown(false);

      // Do nothing if the drop zone is not ready or if nested targets are being hovered
      // https://react-dnd.github.io/react-dnd/examples/nesting/drop-targets
      if (!refDrop.current || !monitor.isOver({ shallow: true })) {
        return;
      }

      const parent = parents[parents.length - 1];
      const [elementParent, elementIndex] = find(type, element.id);
      const isDescendant = type === TYPES.LOT && parents.includes(element.id);

      // It is not possible to move an element in this zone if
      // - it is already in this zone (they have the same parent)
      // - the element is one of the parents of the current zone
      if (parent === elementParent || isDescendant) {
        return;
      }

      // TODO : improve to put the element at the right place, not only first or last position
      // If we drop the element from the top, it is put on the first position
      // If we drop the element from the bottom, it is put on the last position
      const height = heightBetweenCursorAndMiddle(refDrop.current, monitor);
      const index = height < 0 ? 0 : elements.length;

      const source = [elementParent, elementIndex];
      const destination = [parent, index];
      move(type, source, destination);
    },
    hover: (element, monitor) => {
      // Do nothing if the drop zone is not ready or if nested targets are being hovered
      // https://react-dnd.github.io/react-dnd/examples/nesting/drop-targets
      if (!refDrop.current || !monitor.isOver({ shallow: true })) {
        return;
      }

      const parent = parents[parents.length - 1];
      const [elementParent, elementIndex] = find(type, element.id);
      const isDescendant = type === TYPES.LOT && parents.includes(element.id);

      // It is not possible to move an element in this zone if
      // - it is already in this zone (they have the same parent)
      // - the element is one of the parents of the current zone
      if (parent === elementParent || isDescendant) {
        return;
      }

      // TODO : improve to put the element at the right place, not only first or last position
      // If we drop the element from the top, it is put on the first position
      // If we drop the element from the bottom, it is put on the last position
      const height = heightBetweenCursorAndMiddle(refDrop.current, monitor);
      const index = height < 0 ? 0 : elements.length;

      const source = [elementParent, elementIndex];
      const destination = [parent, index];

      if (height < 0) {
        isTop = true;
        isDown = false;
      }
      if (height >= 0) {
        isTop = false;
        isDown = true;
      }

      setIsTop(isTop);
      setIsDown(isDown);
    }
  });


  drop(refDrop);
  const overStyle = isOverCurrent && canDrop ? "gephart-builder-workflow-list-over" : null;
  const topStyle = isOverCurrent && isTop ? "gephart-builder-workflow-list-overTop": null;
  const downStyle = isOverCurrent && isDown ? "gephart-builder-workflow-list-overDown": null;

  return (
    <div ref={refDrop} {...props} className={["gephart-builder-workflow-list", overStyle, topStyle, downStyle, elements.length == 0 ? "gephart-builder-workflow-list-blank" : null].join(" ")}>
      <div className="clearfix">
      {elements.map((element, index) => {
        switch (element.entity) {
          case "Condition":
            As = Condition;
            break;
          case "Edit":
            As = Edit;
            break;
          case "Mail":
            As = Mail;
            break;
          case "Entity":
            As = Entity;
            break;
          case "Base":
          default:
            As = Base;
        }
        return <As key={element.id} index={index} parents={parents} data={element} addLot={index===elements.length-1?addLot:""} />
      })}
      {elements.length == 0 && (
          <div className="gephart-builder-workflow-item-wrap">
            <div className="gephart-builder-workflow-item-blank">
              Nic zde není
            </div>

            {addLot}
          </div>
      )}
    </div>
    </div>
  );
};

export default DroppableZone;
