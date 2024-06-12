  import { findInTree } from "./utils";

export const ACTIONS = {
  MOVE: "MOVE",
  ADD: "ADD",
  REMOVE: "REMOVE"
};

export const reducer = (state, { action, ...args }) => {
  const { container, tree } = state;
  switch (action) {
    case ACTIONS.MOVE: {
      const { type, source, destination } = args;
      const [fromParent, fromIndex] = source;
      const [toParent, toIndex] = destination;

      if (fromParent === toParent && fromIndex === toIndex) {
        return state;
      }

      if (fromParent === toParent) {
        const subTreeFrom = Array.from(tree[fromParent][type]);
        const [element] = subTreeFrom.splice(fromIndex, 1);

        subTreeFrom.splice(toIndex, 0, element);
        return {
          ...state,
          tree: {
            ...tree,
            [fromParent]: {
              ...tree[fromParent],
              [type]: subTreeFrom
            }
          }
        };
      }

      const subTreeFrom = Array.from(tree[fromParent][type]);
      const subTreeTo = Array.from(tree[toParent]?.[type] || []);
      const [element] = subTreeFrom.splice(fromIndex, 1);

      if (element === undefined) return {...state};

      subTreeTo.splice(toIndex, 0, element);
      return {
        ...state,
        tree: {
          ...tree,
          [fromParent]: {
            ...tree[fromParent],
            [type]: subTreeFrom
          },
          [toParent]: {
            ...(tree[toParent] || {}),
            [type]: subTreeTo
          }
        }
      };
    }

    case ACTIONS.ADD: {
      const { type, parent } = args;
      const id = Math.max(...Object.keys(container[type]).map((i)=>parseInt(i))) + 1;

      return {
        container: {
          ...container,
          [type]: {
            ...container[type],
            [id]: { id, title: `New ${id}` }
          }
        },
        tree: {
          ...tree,
          [parent]: {
            ...(tree[parent] || {}),
            [type]: [...(tree[parent]?.[type] || []), id]
          }
        }
      };
    }

    case ACTIONS.REMOVE: {
      const { type, id } = args;

      const [parent, index] = findInTree(tree, type, id);
      const subTree = Array.from(tree[parent][type]);
      subTree.splice(index, 1);
      return {
        ...state,
        tree: {
          ...tree,
          [parent]: {
            ...tree[parent],
            [type]: subTree
          }
        }
      };
    }

    default:
      return state;
  }
};
