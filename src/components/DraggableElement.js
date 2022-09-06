import React, {useRef, useState} from "react";
import { useDrag, useDrop } from "react-dnd";
import { TYPES } from "../constants";
import { useContainerContext } from "./ContainerContext";
import styles from "../styles";
import { heightBetweenCursorAndMiddle } from "../utils";

const DraggableElement = ({
  type,
  id,
  parents,
  index,
  children,
  style,
  ...props
}) => {
  const refPreview = useRef(null);
  let [isTop, setIsTop] = useState(false);
  let [isDown, setIsDown] = useState(false);

  const { move, find } = useContainerContext();
  const [{ isDragging }, drag, preview] = useDrag({
    item: { id },
    type,
    collect: (monitor) => ({
      isDragging: monitor.getItemType() === type && monitor.getItem().id === id
    }),
  });
  const [{isOver, isOverCurrent, canDrop}, drop] = useDrop({
    accept: type,
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

      const parent = parents[parents.length - 1];
      const [elementParent, elementIndex] = find(type, element.id);
      const isDescendant =
          element.type === TYPES.LOT && parents.includes(element.id);

      // It is not possible to swap an element if
      // - it is the element itself
      // - the element is one of the parents of the current element
      if (element.id === id || isDescendant) {
        return;
      }

      // When the elements have the same parent
      // We perform the move when the mouse has crossed half of the element height
      const height = heightBetweenCursorAndMiddle(refPreview.current, monitor);
      let destination;
      if (elementParent === parent) {
        // When dragging downwards, only move when the cursor is below 50%
        // When dragging upwards, only move when the cursor is above 50%
        /*if (
            (elementIndex < index && height < 0) ||
            (elementIndex > index && height > 0)
        ) {
          return;
        }*/
        if ((elementIndex < index && height < 0)) {
          index--;
        }
        if (elementIndex > index && height > 0) {
          index++;
        }
        destination = [parent, index];
      } else {
        // TODO : Explain this use case
        // Not sure if it's a generic "else" case
        // It in order to handle the case when a lot is drag out from another
        // The event is triggered and the height of the main element is with the drag element
        // So we have to remove half the height of the preview (but not so easy to access)
        const indexUpdated = height < 0 ? index : index + 1;
        destination = [parent, indexUpdated];
      }

      const source = [elementParent, elementIndex];

      move(type, source, destination);
    },
    hover: (element, monitor) => {
      // Do nothing if the preview is not ready or if nested targets are being hovered
      // https://react-dnd.github.io/react-dnd/examples/nesting/drop-targets
      if (!refPreview.current || !monitor.isOver({ shallow: true })) {
        return;
      }

      const isDescendant =
          element.type === TYPES.LOT && parents.includes(element.id);

      if (element.id === id || isDescendant) {
        return;
      }
      const height = heightBetweenCursorAndMiddle(refPreview.current, monitor);

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


  //drop(preview(refPreview));
  drop(refPreview);
  const draggingStyle = isDragging ? "gephart-builder-workflow-item-wrap-dragging" : null;
  const overStyle = isOverCurrent && canDrop ? "gephart-builder-workflow-item-wrap-over" : null;
  const topStyle = isOverCurrent && isTop ? "gephart-builder-workflow-item-wrap-overTop": null;
  const downStyle = isOverCurrent && isDown ? "gephart-builder-workflow-item-wrap-overDown": null;

  return (
    <div ref={refPreview}  {...props}
         className={["gephart-builder-workflow-item-wrap", draggingStyle, overStyle, topStyle, downStyle].join(" ")}>
      <div ref={drag} style={styles.draggable} />
      {children}
    </div>
  );
};

export default DraggableElement;
