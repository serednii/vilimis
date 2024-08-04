import React, {useEffect, useRef, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import update from "immutability-helper";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider, useDrag, useDrop} from "react-dnd";
import {getIsTopIsDown, heightBetweenCursorAndMiddle, runMove} from "../../utils";
import {NotePencil, Trash} from "@phosphor-icons/react";

const SettingsProjectsFormProjectStatusItem = ({projectStatus, index, id, moveCard, handleDelete, setModalProjectStatusId, setModalIsOpen}) => {
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

            if (dragIndex === hoverIndex) {
                return
            }

            runMove(ref.current, monitor, dragIndex, hoverIndex, moveCard);

            item.index = hoverIndex
        },
        hover: (element, monitor) => {
            // https://react-dnd.github.io/react-dnd/examples/nesting/drop-targets
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


    const [{isDragging}, drag] = useDrag(() => ({
        type: 'card',
        item: () => {
            return {id, index}
        },
        end(project, monitor) {
            console.log('Dropped!', project);
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
                                backgroundColor: projectStatus.color
                            }}></div>
                        </div>
                        <div>
                            <span className="cursor-pointer" role="presentation"
                                    onClick={() => {
                                        setModalProjectStatusId(projectStatus.id);
                                        setModalIsOpen(true)
                                    }}>
                        {projectStatus.name}
                            </span>
                        </div>
                    </div>
                    <div>
                        <button type="button"
                                onClick={() => {
                                    setModalProjectStatusId(projectStatus.id);
                                    setModalIsOpen(true)
                                }}
                                className="btn btn-sm fs-6 px-1 py-0">
                            <NotePencil size={20} color="#999"/>
                        </button>

                        <button type="button"
                            onClick={() => window.confirm("Opravdu smazat?") && handleDelete(projectStatus.id)}
                            className="btn btn-sm fs-6 px-1 py-0">
                            <Trash size={20} color="#f00"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SettingsProjectsFormProjectStatusItem;