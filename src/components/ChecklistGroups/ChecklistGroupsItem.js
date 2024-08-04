import React, {useRef, useState} from "react";
import ChecklistGroupFormModal from "./ChecklistGroupFormModal";
import {NotePencil} from "@phosphor-icons/react";
import ChecklistItems from "../ChecklistItems/ChecklistItems";
import {useDrag, useDrop} from "react-dnd";
import {getIsTopIsDown, getUpdatedHoverIndex, heightBetweenCursorAndMiddle, runMove} from "../../utils";

const ChecklistGroupsItem = ({id, index, checklistGroup, onChange, moveCard, moveCardItem, checklistItems}) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [isHover, setIsHover] = useState(false);

    let [isTop, setIsTop] = useState(false);
    let [isDown, setIsDown] = useState(false);

    function closeModal() {
        setModalIsOpen(false);
    }


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
            let hoverIndex = index

            if (dragIndex === hoverIndex) {
                return
            }

            runMove(ref.current, monitor, dragIndex, hoverIndex, moveCard);

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
        <>
            <div ref={ref} style={{opacity: isDragging ? 0.5 : 1}}
                 draggable="false"
                 className={"card mb-3 card-item-wrap border-0 shadow "+ topStyle+ downStyle}>
                <div
                    className="card-header d-flex align-items-center justify-content-between border-0 ">

                    <h3 className="h5 mb-0">
                        <span>{checklistGroup.name}</span>
                    </h3>

                    <button className="btn btn-xs btn-link" onClick={() => {
                        setModalIsOpen(true)
                    }}>
                        <NotePencil size={20}/>
                    </button>
                </div>
                <div className="card-body">
                    <div className="card-body-content">
                        <div dangerouslySetInnerHTML={{ __html: checklistGroup.description }} />
                    </div>

                    <ChecklistItems
                        checklistId={checklistGroup.checklistId}
                        checklistGroupId={checklistGroup.id}
                        checklistItems={checklistItems}
                        moveCardItem={moveCardItem}
                        onChange={onChange}
                    />
                </div>
            </div>

            {modalIsOpen && (
                <ChecklistGroupFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setModalIsOpen={setModalIsOpen}
                    id={checklistGroup.id}
                    checklistId={checklistGroup.checklistId}
                    callback={onChange}/>
            )}
        </>
    );
};

export default ChecklistGroupsItem;