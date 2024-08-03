import {MagnifyingGlass} from "@phosphor-icons/react";
import React, {useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {LineWave} from "react-loader-spinner";

const IcoFinder = ({name, defaultValue, onFind, id}) => {
    const [loading, setLoading] = useState(false);
    const [ic, setIc] = useState(defaultValue);
    const {API} = useRootContext()

    const runFind = () => {
        setLoading(true);

        API.getData("/ares/find/" + ic, (data) => {
            onFind(data);
            setLoading(false);
        });
    };

    return (
        <>
            <div className="d-flex">
                <input defaultValue={defaultValue}
                        onChange={e => setIc(e.target.value)}
                       type="text" name={name} className="me-3 form-control"
                       id={id}/>
                <button type="button" className="btn btn-primary" onClick={() => runFind()}>
                    {loading ? (
                        <LineWave
                            visible={true}
                            height="16"
                            width="16"
                            color="#fff"
                            ariaLabel="line-wave-loading"
                            wrapperStyle={{}}
                            wrapperClass=""
                            firstLineColor=""
                            middleLineColor=""
                            lastLineColor=""
                        />
                    ) : (
                        <MagnifyingGlass size={16}/>
                    )}

                </button>
            </div>
        </>
    );
}

export default IcoFinder;