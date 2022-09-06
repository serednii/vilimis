const styles = {
  item: {
    background: "white",
    border: "2px solid red",
    padding: 10
  },
  lot: {
    position: "relative",
    marginLeft: 20
  },
  lotIn: {
    borderRadius: "20px",
    border: "4px #f2f7ff solid",
    background: "#f2f7ff",
    padding: 30,
    position: "relative",
  },
  items: {
    background: "pink",
    display: "grid",
    gap: 5,
    padding: 5,
    marginTop: 20
  },
  lots: {
    display: "grid",
    gap: 20,
    padding: 0,
    position: "relative"
    /*marginTop: 20*/
  },
  draggable: {
    display: "inline-block",
    width: 20,
    height: 20,
    background: "#eee",
    borderRadius: "100%",
    cursor: "move",
    position: "absolute",
    zIndex: "10",
    top: "8px",
    left: "8px"
  },
  dragging: {
    opacity: 0.4,
    background: "#fff"
    /*height: "2px",
    overflow: "hidden"*/
  }
};

export default styles;
