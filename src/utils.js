
export const findInTree = (tree, type, id) => {
  return Object.entries(tree).reduce((acc, [lotId, children]) => {
    if (acc !== undefined) {
      return acc;
    }

    const index = (children[type] || []).findIndex((_id) => id === _id);
    if (index < 0) {
      return acc;
    }

    const parent = parseInt(lotId);
    return [parent, index];
  }, undefined);
};

export const getIsTopIsDown = (element, monitor)=> {
  const height = heightBetweenCursorAndMiddle(element, monitor);
  let isTop = false;
  let isDown = false;

  if (height < 0) {
    isTop = true;
    isDown = false;
  }
  if (height >= 0) {
    isTop = false;
    isDown = true;
  }

  return [isTop, isDown];
}

export const runMove = (element, monitor, dragIndex, hoverIndex, moveCard) => {
  let [isTop, isDown] = getIsTopIsDown(element, monitor);
  hoverIndex = getUpdatedHoverIndex(dragIndex, hoverIndex, isTop, isDown);

  if (isDown) {
    moveCard(dragIndex, hoverIndex)
  } else {
    moveCard(dragIndex, hoverIndex)
  }
}

export const runMoveItem = (element, monitor, dragIndex, hoverIndex, dragGroupId, hoverGroupId, moveCardItem) => {
  let [isTop, isDown] = getIsTopIsDown(element, monitor);
  hoverIndex = getUpdatedHoverIndexItem(dragIndex, hoverIndex, isTop, isDown, dragGroupId, hoverGroupId);

  if (isDown) {
    moveCardItem(dragIndex, hoverIndex, dragGroupId, hoverGroupId)
  } else {
    moveCardItem(dragIndex, hoverIndex, dragGroupId, hoverGroupId)
  }
}

export const getUpdatedHoverIndexItem = (dragIndex, hoverIndex, isTop, isDown, dragGroupId, hoverGroupId) => {

  if (dragGroupId == hoverGroupId && dragIndex > hoverIndex && isDown) {
    hoverIndex++;
  }

  if (dragGroupId != hoverGroupId && isDown) {
    hoverIndex++;
  }

  if (dragGroupId == hoverGroupId && dragIndex < hoverIndex && isTop) {
    hoverIndex--;
  }

  return hoverIndex;
}

export const getUpdatedHoverIndex = (dragIndex, hoverIndex, isTop, isDown) => {

  if (dragIndex > hoverIndex && isDown) {
    hoverIndex++;
  }

  if (dragIndex < hoverIndex && isTop) {
    hoverIndex--;
  }

  return hoverIndex;
}

export const heightBetweenCursorAndMiddle = (element, monitor) => {
  const hoverBoundingRect = element.getBoundingClientRect();
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  const clientOffset = monitor.getSourceClientOffset();
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;
  return hoverClientY - hoverMiddleY;
};

export function parseTime(time) {
  const seconds = Math.round(time / 1000);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return {
    d,
    h,
    m,
    s,
  };
}
