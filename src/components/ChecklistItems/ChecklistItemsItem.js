import React, {useRef, useState} from "react";
import ChecklistItemFormModal from "./ChecklistItemFormModal";
import {NotePencil} from "@phosphor-icons/react";
import {useRootContext} from "../../contexts/RootContext";
import {useDrag, useDrop} from "react-dnd";
import {getIsTopIsDown, runMove, runMoveItem} from "../../utils";

const ChecklistItemsItem = ({checklistItem, onChange, index, id, moveCardItem}) => {
    const {API} = useRootContext();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [checklistItemClone, setChecklistItemClone] = useState(checklistItem);

    let [isTop, setIsTop] = useState(false);
    let [isDown, setIsDown] = useState(false);

    function closeModal() {
        setModalIsOpen(false);
    }

    function handleChangeDone(done) {
        const formData = new FormData();

        formData.append("id", checklistItemClone.id);
        formData.append("done", done?1:0);

        API.postData("/checklistItemDone/save", formData, (data) => {
            setChecklistItemClone(data.checklistItem);
        });
    }

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
            const hoverChecklistGroupId = checklistItem.checklistGroupId;

            if (dragIndex === hoverIndex && dragChecklistGroupId === hoverChecklistGroupId) {
                return
            }

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


    const [{isDragging}, drag] = useDrag(() => ({
        type: 'card_item',
        item: () => {
            return {id, index, checklistGroupId: checklistItem.checklistGroupId}
        },
        end(task, monitor) {
            console.log('Dropped!', task);
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    drag(drop(ref))

    const topStyle = isOverCurrent && isTop ? " is-overTop ": "";
    const downStyle = isOverCurrent && isDown ? " is-overDown ": "";
    const draggingStyle = isDragging ? " is-dragging ": "";

    return (
        <>
            <div ref={ref} className={"checklist-item "+ (checklistItemClone.done?" is-done ":"")+ topStyle + downStyle+draggingStyle}>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" defaultChecked={checklistItemClone.done}
                           onChange={(e)=>handleChangeDone(e.target.checked)}
                           id={"checklistItem-" + checklistItemClone.id}/>
                    <label className="form-check-label"
                           htmlFor={"checklistItem-" + checklistItemClone.id}>
                        {checklistItemClone.name}


                        <button className="btn btn-xs btn-link" onClick={() => {
                            setModalIsOpen(true)
                        }}>
                            <NotePencil size={12}/>
                        </button>
                    </label>
                </div>
                <div dangerouslySetInnerHTML={{__html: checklistItemClone.description}}/>

                {modalIsOpen && (
                    <ChecklistItemFormModal
                        isOpen={modalIsOpen}
                        onRequestClose={closeModal}
                        setModalIsOpen={setModalIsOpen}
                        id={checklistItemClone.id}
                        checklistId={checklistItemClone.checklistId}
                        checklistGroupId={checklistItemClone.checklistGroupId}
                        callback={onChange}/>
                )}
            </div>
        </>
    );
};

export default ChecklistItemsItem;