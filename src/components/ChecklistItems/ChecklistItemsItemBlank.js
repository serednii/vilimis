import React, {useRef, useState} from "react";
import ChecklistItemFormModal from "./ChecklistItemFormModal";
import {NotePencil} from "@phosphor-icons/react";
import {useRootContext} from "../../contexts/RootContext";
import {useDrag, useDrop} from "react-dnd";
import {getIsTopIsDown, runMove, runMoveItem} from "../../utils";

const ChecklistItemsItemBlank = ({checklistGroupId, onChange, index, id, moveCardItem}) => {

    let [isTop, setIsTop] = useState(false);
    let [isDown, setIsDown] = useState(false);


    const ref = useRef(null)
    const [{handlerId, isOver, isOverCurrent}, drop] = useDrop({
        accept: "card_item",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
                isOver: monitor.isOver(),
                isOverCurrent: monitor.isOver({shallow: true}),
            }
        },
        drop(item, monitor) {
            setIsTop(false);
            setIsDown(false);
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const dragChecklistGroupId = item.checklistGroupId;
            let hoverIndex = index
            const hoverChecklistGroupId = checklistGroupId;


            runMoveItem(ref.current, monitor, dragIndex, hoverIndex, dragChecklistGroupId, hoverChecklistGroupId, moveCardItem);

            item.index = hoverIndex
        },
        hover: (element, monitor) => {
            if (!ref.current || !monitor.isOver({shallow: true})) {
                return;
            }

            if (element.id === id) {
                return;
            }

            let [isTop, isDown] = getIsTopIsDown(ref.current, monitor);

            setIsTop(isTop);
            setIsDown(isDown);
        }
    }, [])

    drop(ref)

    const topStyle = isOverCurrent && isTop ? " is-overTop ": "";
    const downStyle = isOverCurrent && isDown ? " is-overDown ": "";

    return (
        <>
            <div ref={ref} className={"checklist-item "+ topStyle + downStyle}>
                Zatím žádné položky
            </div>
        </>
    );
};

export default ChecklistItemsItemBlank;