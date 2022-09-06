import React, { useReducer } from "react";
import { ContainerContextProvider } from "./components/ContainerContext";
import { ACTIONS, reducer } from "./reducer";
import { TYPES } from "./constants";
import styles from "./styles";
import { findInTree } from "./utils";
import LotContent from "./components/LotContent";

const INITIAL_STATE = {
  container: {
    [TYPES.LOT]: {
      0: { id: 0, title: "Container" }, // Special lot
      1: { id: 1, title: "Obchodní příležitost", entity: "Entity" },
      2: { id: 2, title: "Při změně", entity: "Condition", text: "Pole <strong>Stav</strong> se změní na <strong>Odesláno</strong>" },

      3: { id: 3, title: "Odeslat email", text: "Email: Vaše objednávka byla odeslána", entity: "Mail" },
      4: { id: 4, title: "Upravit entitu", text: "Pole <strong>E-mail odeslán</strong> změnit na <strong>aktuální čas</strong>", entity: "Edit" }
    },
    [TYPES.ITEM]: {
      1: { id: 1, title: "Item 1" },
      2: { id: 2, title: "Item 2" },
      3: { id: 3, title: "Item A.1" },
      4: { id: 4, title: "Item A.2" }
    }
  },
  tree: {
    0: {
      /*[TYPES.ITEM]: [1, 2],*/
      [TYPES.LOT]: [1, 2]
    },
    2: {
      [TYPES.LOT]: [3, 4]
    },
    /*1: {
      [TYPES.ITEM]: [3, 4]
    }*/
  }
};

const App = () => {
  const [{ container, tree }, dispatch] = useReducer(reducer, INITIAL_STATE);
  const find = (type, id) => findInTree(tree, type, id);
  const move = (type, source, destination) =>
    dispatch({ action: ACTIONS.MOVE, type, source, destination });
  const add = (type, parent) => dispatch({ action: ACTIONS.ADD, type, parent });
  const remove = (type, id) => dispatch({ action: ACTIONS.REMOVE, type, id });

  return (
    <ContainerContextProvider
      value={{ container, tree, move, find, add, remove }}
    >
      <div style={styles.container}>
        <LotContent lot={container[TYPES.LOT][0]} />
      </div>
    </ContainerContextProvider>
  );
};

export default App;
