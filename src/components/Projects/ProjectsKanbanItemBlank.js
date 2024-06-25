import React, {useRef} from "react";
import {useDrop} from 'react-dnd'

const ProjectsKanbanItemBlank = ({index, id, onUpdate, moveCard, projectStatusId}) => {

    const ref = useRef(null)
    const [{handlerId, isOver}, drop] = useDrop({
        accept: "card",
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
                isOver: monitor.isOver(),
                isOverCurrent: monitor.isOver({shallow: true}),
            }
        },
        drop(item, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index
            // Time to actually perform the action
            moveCard(dragIndex, hoverIndex, item.projectStatusId, projectStatusId)
            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    }, [])


    drop(ref)

    return (
        <>
            <div ref={ref} style={{opacity: 0.5 }} className=" dropzone-nohover d-flex justify-content-center align-items-center text-center shadow "
                 draggable="false">
<div>
                    Přesuňte sem
</div>
            </div>
        </>
    )
        ;

};

export default ProjectsKanbanItemBlank;