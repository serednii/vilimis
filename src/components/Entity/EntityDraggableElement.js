import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styles from "../../styles";
import { heightBetweenCursorAndMiddle } from "../../utils";
import { useEntityContext } from "./EntityContext";

const EntityDraggableElement = ({
  id,
  index,
  children,
  style,
  ...props
}) => {
  const refPreview = useRef(null);
  let [isTop, setIsTop] = useState(false);
  let [isDown, setIsDown] = useState(false);

  const { move, find } = useEntityContext();
  const [{ isDragging }, drag] = useDrag({
    item: { id },
    type: "entity",
    collect: (monitor) => ({
      isDragging: monitor.getItem() && monitor.getItem().id === id
    }),
  });
  const [{ isOver, isOverCurrent, canDrop }, drop] = useDrop({
    accept: "entity",
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
    drop: (element, monitor) => {
      setIsTop(false);
      setIsDown(false);

      // Do nothing if the preview is not ready or if nested targets are being hovered
      // https://react-dnd.github.io/react-dnd/examples/nesting/drop-targets
      if (!refPreview.current || !monitor.isOver({ shallow: true })) {
        return;
      }

      // When the elements have the same parent
      // We perform the move when the mouse has crossed half of the element height
      const height = heightBetweenCursorAndMiddle(refPreview.current, monitor) + 24;
      let destination;
      const elementIndex = find(element.id);

      if ((elementIndex < index && height < 0)) {
        index--;
      }
      if (elementIndex > index && height > 0) {
        index++;
      }
      destination = index;

      const source = elementIndex;

      move(source, destination);
    },
    hover: (element, monitor) => {
      // Do nothing if the preview is not ready or if nested targets are being hovered
      // https://react-dnd.github.io/react-dnd/examples/nesting/drop-targets
      if (!refPreview.current || !monitor.isOver({ shallow: true })) {
        return;
      }

      if (element.id === id) {
        return;
      }
      const height = heightBetweenCursorAndMiddle(refPreview.current, monitor) + 24;

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

  drop(refPreview);
  const draggingStyle = isDragging ? "gephart-generator-entity-item-wrap-dragging" : null;
  const overStyle = isOverCurrent && canDrop ? "gephart-generator-entity-item-wrap-over" : null;
  const topStyle = isOverCurrent && isTop ? "gephart-generator-entity-item-wrap-overTop" : null;
  const downStyle = isOverCurrent && isDown ? "gephart-generator-entity-item-wrap-overDown" : null;

  return (
    <div ref={refPreview}  {...props}
      className={["gephart-generator-entity-item-wrap", draggingStyle, overStyle, topStyle, downStyle].join(" ")}>
      <div ref={drag} style={styles.draggable} />
      <div className={"clearfix"}>
        <div className={"gephart-generator-entity-item"}>
          <div className="gephart-generator-entity-item-text">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntityDraggableElement;
