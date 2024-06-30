
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

export const heightBetweenCursorAndMiddle = (element, monitor) => {
  const hoverBoundingRect = element.getBoundingClientRect();
  const hoverMiddleY = (hoverBoundingRect.bottom + hoverBoundingRect.top) / 2;
  const clientOffset = monitor.getSourceClientOffset();
  const hoverClientY = clientOffset.y;
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
