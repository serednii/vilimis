
import { useState } from "react";
import { useEntityContext } from "./EntityContext";

const EntityForm = () => {
  const {propertiesSelected, changPropertiesSelectedObjId, id } = useEntityContext();
  console.log(id)
  let findIndex = propertiesSelected.findIndex(el => el.id === id);

if (findIndex === null || findIndex < 0 || findIndex >= propertiesSelected.length) {
    throw Error('Error index Entity Form')
}

  const objId = propertiesSelected[findIndex];
  const [name, setName] = useState(objId.name);
  const [slug, setSlug] = useState(objId.slug);
  const [type, setType] = useState(objId.type);

  const handleSavePropertiesSelectedObjId = () => {
    const newObjId = {
      ...objId,
      name,
      slug,
      type,
    };

    changPropertiesSelectedObjId(newObjId);
  };

  return (
    <form>
      <div className="col-12 col-md-auto">
        <div className="mb-4">
          <label htmlFor={"property-name_"}>Název</label>
          <input type="text" onChange={(event => setName(event.target.value))} value={name} className="form-control"  />
        </div>
      </div>
      <div className="col-12 col-md-auto">
        <div className="mb-4">
          <label htmlFor={"property-slug_"}>Slug</label>
          <input type="text" onChange={(event => setSlug(event.target.value))} value={slug} className="form-control"  />
        </div>
      </div>
      <div className="col-12 col-md-auto">
        <div className="mb-4">
          <label htmlFor={"property-type_"}>Typ</label>
          <input type="text" onChange={(event => setType(event.target.value))} value={type} className="form-control"  />
        </div>
      </div>

      <div className={"gephart-generator-entity-item-wrap"}>
        <button
          onClick={handleSavePropertiesSelectedObjId}
          type="button"
          className={"btn btn-secondary"}
        >
          Uložit
        </button>
      </div>
    </form>
  );
};

export default EntityForm;
