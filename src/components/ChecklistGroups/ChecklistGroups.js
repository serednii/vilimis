import ChecklistGroupsItem from "./ChecklistGroupsItem";
import React, {useEffect, useState} from "react";
import {Plus} from "@phosphor-icons/react";
import {useRootContext} from "../../contexts/RootContext";
import ChecklistGroupFormModal from "./ChecklistGroupFormModal";
import update from "immutability-helper";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";

const ChecklistGroups = ({checklistId}) => {
    const {API} = useRootContext()
    const [reload, setReload] = useState(true);
    const [checklistGroups, setChecklistGroups] = useState([]);
    const [checklistItems, setChecklistItems] = useState([]);

    const [checklistsGroupsLoading, setChecklistsGroupsLoading] = useState(false);
    const [checklistsItemsLoading, setChecklistsItemsLoading] = useState(false);


    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const [modalChecklistGroupId, setModalChecklistGroupId] = React.useState(0);

    function closeModal() {
        setModalIsOpen(false);
    }


    function handleDelete(id, noreload) {
        API.getData("/checklistGroups/delete/" + id, () => {
            if (!noreload) {
                setReload(true);
            }
        });
    }

    useEffect(() => {
        if (!reload) return;

        setChecklistsGroupsLoading(true);
        setChecklistsItemsLoading(true);

        let url = "/checklistGroup/list";
        url += "?"
        url += "&filter[checklist_id]=" + encodeURIComponent(checklistId);
        url += "&order=priority";

        API.getData(url, (checklistGroups) => {
            setChecklistGroups(checklistGroups);
            setChecklistsGroupsLoading(false);


            let url = "/checklistItem/list";
            url += "?"
            url += "&filter[checklist_id]=" + encodeURIComponent(checklistId);
            url += "&order=priority";

            API.getData(url, (checklistItems) => {
                let newChecklistItems = [];
                checklistGroups.forEach((checklistGroup) => {
                    if (checklistGroup.id > 0) {
                        newChecklistItems[checklistGroup.id] = checklistItems.filter((checklistItem) => checklistItem.checklistGroupId === checklistGroup.id);
                    }
                })
                setChecklistItems(newChecklistItems);
                setChecklistsItemsLoading(false);
            });
        });

        setReload(false);
    }, [checklistId, reload]);



    const moveCardItem = (dragIndex, hoverIndex, checklistGroupId, hoverChecklistGroupId) => {

        if (!checklistGroupId) {
            return;
        }

        if (checklistGroupId === hoverChecklistGroupId) {
            setChecklistItems((prevCards) => {
                    prevCards[checklistGroupId] = update(prevCards[checklistGroupId], {
                        $splice: [
                            [dragIndex, 1],
                            [hoverIndex, 0, prevCards[checklistGroupId][dragIndex]],
                        ]
                    })

                    let formData = new FormData;
                    prevCards[checklistGroupId].forEach((card, index) => {
                        formData.append("checklistItems[id][]", card.id);
                        formData.append("checklistItems[priority][]", index);
                        formData.append("checklistItems[checklist_group_id][]", checklistGroupId);
                    });
                    API.postData("/checklistItemPriority/save", formData);

                    return prevCards;
                }
            )
        } else if (checklistGroupId > 0) {
            setChecklistItems((prevCards) => {
                let newCard = prevCards[checklistGroupId][dragIndex];
                newCard.checklistGroupId = hoverChecklistGroupId;

                prevCards[checklistGroupId] = update(prevCards[checklistGroupId], {
                    $splice: [
                        [dragIndex, 1]
                    ]
                });

                prevCards[hoverChecklistGroupId] = update(prevCards[hoverChecklistGroupId], {
                    $splice: [
                        [hoverIndex, 0, newCard],
                    ]
                });

                let formData = new FormData;
                prevCards[checklistGroupId].forEach((card, index) => {
                    formData.append("checklistItems[id][]", card.id);
                    formData.append("checklistItems[priority][]", index);
                    formData.append("checklistItems[checklist_group_id][]", checklistGroupId);
                });
                prevCards[hoverChecklistGroupId].forEach((card, index) => {
                    formData.append("checklistItems[id][]", card.id);
                    formData.append("checklistItems[priority][]", index);
                    formData.append("checklistItems[checklist_group_id][]", hoverChecklistGroupId);
                });

                API.postData("/checklistItemPriority/save", formData, ()=>{
                    setReload((prev) => prev + 1);
                });

                return prevCards;
            });
        }

    };


    const moveCard = (dragIndex, hoverIndex) => {
        setChecklistGroups((prevCards) => {
                prevCards = update(prevCards, {
                    $splice: [
                        [dragIndex, 1],
                        [hoverIndex, 0, prevCards[dragIndex]],
                    ]
                })

                let formData = new FormData;
                prevCards.forEach((card, index) => {
                    formData.append("checklistGroups[id][]", card.id);
                    formData.append("checklistGroups[priority][]", index);
                });
                API.postData("/checklistGroupPriority/save", formData, () => {
                    setReload((prev) => prev + 1);
                });

                return prevCards;
            }
        )

    };

    return (
        <>
            {/*checklistsGroupsLoading ? (
                <>Načítaní..</>
            ) : (*/}
            {checklistGroups?.length > 0 ? (

                <DndProvider backend={HTML5Backend}>
                    {checklistGroups?.map((checklistGroup, index) => (
                        <ChecklistGroupsItem
                            key={checklistGroup.id+"_"+index}
                            id={checklistGroup.id}
                            index={index}
                            moveCard={moveCard}
                            moveCardItem={moveCardItem}
                            checklistGroup={checklistGroup}
                            checklistItems={checklistItems[checklistGroup.id]}
                            onChange={() => setReload(true)}
                        />
                    ))}
                </DndProvider>
                ) : (
                    <p>Zatím žádné skupiny</p>
                )}
            {/*)}*/}


            <div className="my-3">
                <button onClick={() => {
                    setModalIsOpen(true);
                    setModalChecklistGroupId(null);
                }}
                        className="btn btn-secondary d-inline-flex align-items-center me-2">
                    <Plus size={16} className="me-2"/>
                    Nová skupina
                </button>
            </div>

            {modalIsOpen && (
                <ChecklistGroupFormModal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    setModalIsOpen={setModalIsOpen}
                    id={modalChecklistGroupId}
                    checklistId={checklistId}
                    callback={() => setReload(true)}/>
            )}
        </>
    );
};

export default ChecklistGroups;