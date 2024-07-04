import React, {useState} from "react";
import CryptoJS from "crypto-js";
import {useRootContext} from "../contexts/RootContext";

const CypherTextarea = ({defaultValue, defaultIsCrypted, nameIsCrypted, name, id, onChange, rows}) => {
    let [secret, setSecret] = useState("");
    const [value, setValue] = useState(defaultValue);
    const [isCrypted, setIsCrypted] = useState(defaultIsCrypted);

    const {toast} = useRootContext();

    const encrypt = () => {
        if (secret == "") {
            let newSecret = prompt("Zadejte jakékoli heslo pro zašifrování:");

            if (newSecret != null) {
                setSecret(newSecret);
                secret = newSecret;
                encrypt();
            }
            return;
        }

        let appkey = CryptoJS.enc.Utf8.parse(secret);
        let secSpec = CryptoJS.enc.Utf8.parse(appkey);
        let ivSpec = CryptoJS.enc.Utf8.parse(appkey);

        secSpec = CryptoJS.lib.WordArray.create(secSpec.words.slice(0, 16/4));
        ivSpec = CryptoJS.lib.WordArray.create(ivSpec.words.slice(0, 16/4));

        let encrypted = CryptoJS.AES.encrypt(value, secSpec, {iv: ivSpec}).toString();

        setValue(encrypted);
        setIsCrypted(true);
    };

    const decrypt = () => {
        if (secret == "") {
            let newSecret = prompt("Zadejte heslo pro dešifrování:");

            if (newSecret != null) {
                setSecret(newSecret);
                secret = newSecret;
                decrypt();
            }
            return;
        }

        let appkey = CryptoJS.enc.Utf8.parse(secret);
        let secSpec = CryptoJS.enc.Utf8.parse(appkey);
        let ivSpec = CryptoJS.enc.Utf8.parse(appkey);

        secSpec = CryptoJS.lib.WordArray.create(secSpec.words.slice(0, 16/4));
        ivSpec = CryptoJS.lib.WordArray.create(ivSpec.words.slice(0, 16/4));

        try {
            let decrypted = CryptoJS.AES.decrypt(value, secSpec, {iv: ivSpec}).toString(CryptoJS.enc.Utf8);

            setValue(decrypted);
            setIsCrypted(false);
        } catch (e) {
            secret = "";
            setSecret("");
            toast.error("Dešifrování neproběhlo, nejspíš špatné heslo.");
        }
    };

    return (
        <div className="position-relative">
            <input type="hidden" name={nameIsCrypted} value={isCrypted?1:0}/>
            <textarea
                        value={value}
                      className="form-control"
                      name={name}
                      rows={rows}
                      readOnly={isCrypted}
                      onChange={(e) => {setValue(e.target.value); if (onChange) {onChange()}}}
                      id={id}/>
                <div style={{position:"absolute",top:"5px",right: "5px"}}>
                {isCrypted ? (
                    <button type="button" className="btn btn-danger" onClick={decrypt}>Dešifrovat</button>
                ): (
                    <button type="button" className="btn btn-success" onClick={encrypt}>Zašifrovat</button>
                )}
            </div>
        </div>
    );
}

export default CypherTextarea;