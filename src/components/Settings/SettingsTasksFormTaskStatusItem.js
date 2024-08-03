import React, {useEffect, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import update from "immutability-helper";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {heightBetweenCursorAndMiddle} from "../../utils";
import {NotePencil, Trash} from "@phosphor-icons/react";

const SettingsTasksFormTaskStatusItem = ({taskStatus, index, id, moveCard, handleDelete, setModalTaskStatusId, setModalIsOpen}) => {
    let [isTop, setIsTop] = useState(false);
    let [isDown, setIsDown] = useState(false);



    const ref = useRef(null)
    const [{handlerId, isOver, isOverCurrent}, drop] = useDrop({
        accept: "card",
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
            const hoverIndex = index
            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }
            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()
            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
            // Determine mouse position
            const clientOffset = monitor.getClientOffset()
            // Get pixels to the top
            const hoverClientY = clientOffset.y - hoverBoundingRect.top
            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%
            // Dragging downwards
            if (dragIndex == hoverIndex-1 && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if ((dragIndex == hoverIndex+1 && hoverClientY > hoverMiddleY)) {
                return
            }

            // Time to actually perform the action
            if (isDown) {
                moveCard(dragIndex, hoverIndex)
            } else {
                moveCard(dragIndex, hoverIndex)
            }
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
        hover: (element, monitor) => {
            // Do nothing if the preview is not ready or if nested targets are being hovered
            // https://react-dnd.github.io/react-dnd/examples/nesting/drop-targets
            if (!ref.current || !monitor.isOver({shallow: true})) {
                return;
            }

            if (element.id === id) {
                return;
            }
            const height = heightBetweenCursorAndMiddle(ref.current, monitor) + 24;

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
    }, [])


    const [{isDragging}, drag] = useDrag(() => ({
        type: 'card',
        item: () => {
            return {id, index}
        },
        end(task, monitor) {
            console.log('Dropped!', task);
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    drag(drop(ref))

    const topStyle = isOverCurrent && isTop ? " card-item-wrap-overTop": "";
    const downStyle = isOverCurrent && isDown ? " card-item-wrap-overDown": "";

    return (
        <div ref={ref} style={{opacity: isDragging ? 0.5 : 1}} className={"card mb-3 card-item-wrap border-0 shadow "+ topStyle+ downStyle}
             draggable="false">
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <div className="d-flex">
                        <div>
                            <div className="me-3" style={{
                                width: "20px",
                                height: "20px",
                                backgroundColor: taskStatus.color
                            }}></div>
                        </div>
                        <div>
                            <span className="cursor-pointer" role="presentation"
                                    onClick={() => {
                                        setModalTaskStatusId(taskStatus.id);
                                        setModalIsOpen(true)
                                    }}>
                        {taskStatus.name}
                            </span>
                        </div>
                    </div>
                    <div>
                        <button type="button"
                                onClick={() => {
                                    setModalTaskStatusId(taskStatus.id);
                                    setModalIsOpen(true)
                                }}
                                className="btn btn-sm fs-6 px-1 py-0">
                            <NotePencil size={20} color="#999"/>
                        </button>

                        <button type="button"
                            onClick={() => window.confirm("Opravdu smazat?") && handleDelete(taskStatus.id)}
                            className="btn btn-sm fs-6 px-1 py-0">
                            <Trash size={20} color="#f00"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsTasksFormTaskStatusItem;