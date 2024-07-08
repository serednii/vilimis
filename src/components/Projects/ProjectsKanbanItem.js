import React, {useRef, useState} from "react";
import {CONFIG} from "../../config";
import ProjectFormModal from "../Projects/ProjectFormModal";
import {useDrag, useDrop} from 'react-dnd'
import {heightBetweenCursorAndMiddle} from "../../utils";
import BudgetCalculator from "../../utils/BudgetCalculator";
import {NotePencil} from "@phosphor-icons/react";

const ProjectsKanbanItem = ({index, id, onUpdate, project, endCustomers, clients, moveCard, projectStatusId}) => {
    let dateP1 = new Date((new Date()).getTime() + 24 * 60 * 60 * 1000);
    let dateP2 = new Date((new Date()).getTime() + 2 * 24 * 60 * 60 * 1000);
    let dateP7 = new Date((new Date()).getTime() + 7 * 24 * 60 * 60 * 1000);
    let dateP31 = new Date((new Date()).getTime() + 31 * 24 * 60 * 60 * 1000);
    const refPreview = useRef(null);
    let isImg = false;
    let [isTop, setIsTop] = useState(false);
    let [isDown, setIsDown] = useState(false);

    const [modalIsOpen, setIsOpen] = React.useState(false);
    const [modalProjectId, setModalProjectId] = React.useState(0);

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
    }

    function closeModal() {
        setIsOpen(false);
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
            const hoverIndex = index
            // Don't replace items with themselves
            if (item.projectStatusId == projectStatusId && dragIndex === hoverIndex) {
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
            if (item.projectStatusId == projectStatusId && dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }
            // Dragging upwards
            if ((item.projectStatusId == projectStatusId && dragIndex > hoverIndex && hoverClientY > hoverMiddleY)) {
                return
            }

            // Time to actually perform the action
            if (item.projectStatusId != projectStatusId && isDown) {
                moveCard(dragIndex, hoverIndex+1, item.projectStatusId, projectStatusId)
            } else {

                moveCard(dragIndex, hoverIndex, item.projectStatusId, projectStatusId)
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
            return {id, index, projectStatusId}
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

    let tmpClient = null;

    return (
        <>
            <div ref={ref} style={{opacity: isDragging ? 0.5 : 1}} className={"card card-item-wrap border-0 shadow p-3 "+ topStyle+ downStyle}
                 draggable="false">
                <div
                    className="card-header d-flex align-items-center justify-content-between border-0 p-0 mb-3">
                    <h3 className="h5 mb-0">{project.name}</h3>
                    <div className="align-self-start">
                        <div className="dropdown">
                            <button type="button"
                                    onClick={() => {
                                        setModalProjectId(project.id);
                                        setIsOpen(true)
                                    }}
                                    className="btn btn-sm fs-6 px-1 py-0">
                                <NotePencil size={20} color="#999"/>
                            </button>
                        </div>
                    </div>
                </div>
                <div className="card-body p-0">

                    <div className="row">
                        <div className="col-6">
                            {isImg = false}
                                <React.Fragment>

                                    {"endCustomerId" in project && project.endCustomerId && endCustomers.filter(endCustomer => endCustomer.id === project.endCustomerId).map((endCustomer, endCustomer_index) => (
                                        endCustomer.logo && (
                                            <React.Fragment key={endCustomer_index}>
                                                <img className="card-img-top mb-2 mb-lg-3" draggable="false"
                                                     src={CONFIG.uploadDir + endCustomer.logo}/>
                                                {isImg = true}
                                            </React.Fragment>
                                        )
                                    ))}
                                    {!isImg && "clientId" in project && project.clientId && clients.filter(client => client.id === project.clientId).map((client, client_index) => (
                                        <React.Fragment key={client_index}>
                                            <img className="card-img-top mb-2 mb-lg-3" draggable="false"
                                                 src={CONFIG.uploadDir + client.logo}/>
                                        </React.Fragment>
                                    ))}
                                </React.Fragment>
                        </div>
                        <div className="col-6">
                            <p>
                                    <React.Fragment>
                                        {project.name}
                                        {"clientId" in project && project.clientId && clients.filter(client => client.id === project.clientId).map((client, client_index) => (
                                            <React.Fragment key={client_index}>
                                                {(tmpClient = client) && ""}
                                                &nbsp;/ {client.name}
                                            </React.Fragment>
                                        ))}
                                    </React.Fragment>
                            </p></div>
                        {project.spendingTime > 0 ? (
                            <>
                                <div>
                                    Strávený čas: {(new BudgetCalculator(project.spendingTime, null, project, tmpClient)).calculareSpendingHoursNicely()}
                                    {project?.hourBudget > 0 && (
                                        <>
                                        &nbsp;
                                    (zbývá: {(new BudgetCalculator(project.spendingTime, null, project, tmpClient)).calculateLeftHoursBudgetNicely()})
                                        </>
                                    )}<br/>
                                    Častka: {(new BudgetCalculator(project.spendingTime, null, project, tmpClient)).calculareForInvoincingNicely("Kč")}
                                </div>
                            </>
                        ): ""}
                    </div>


                    {"deadLineDate" in project && project.deadLineDate && "date" in project.deadLineDate && (
                        <>
                            <div className="d-flex align-items-center">
                                <svg className="icon icon-xxs text-gray-400 me-1"
                                     fill="currentColor"
                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                          clipRule="evenodd"></path>
                                </svg>
                                <span className="small">
                                                            {dateP1 > (new Date(project.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do 24 hodin - </span>
                                                            ) : dateP2 > (new Date(project.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do 2 dní - </span>
                                                            ) : dateP7 > (new Date(project.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do týdne - </span>
                                                            ) : dateP31 > (new Date(project.deadLineDate.date)) ? (
                                                                <span style={{color: "red"}}> do měsíce - </span>
                                                            ) : ""}
                                    {(new Date(project.deadLineDate.date)).toLocaleString()}
                                            </span>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {
                modalIsOpen && (
                    <ProjectFormModal
                        isOpen={modalIsOpen}
                        onAfterOpen={afterOpenModal}
                        onRequestClose={closeModal}
                        setIsOpen={setIsOpen}
                        callback={onUpdate}
                        id={modalProjectId}/>
                )
            }
        </>
    )
        ;

};

export default ProjectsKanbanItem;