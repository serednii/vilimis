import React, {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";

const SettingsBaseForm = ({}) => {
    const {API} = useRootContext()
    const [settings, setSettings] = useState([]);

    useEffect(() => {
        loadSettings();
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
        event.stopPropagation();

        const formData = new FormData(event.target);

        API.postData("/settings/save", formData, () => {
            loadSettings();
        });
    }

    const loadSettings = () => {
        API.getData("/setting/list", (settings) => {
            const kvSettings = {};
            settings.map((setting) => {
                kvSettings[setting.key] = setting.value;
            })
            setSettings(kvSettings);
        });
    }

    if (!settings) {
        return (<>Načítaní..</>)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="row">
                <div className="col-12 col-md-8">
                    <h2 className="h5 mb-3">Základní nastavení</h2>
                    <div className="mb-3">
                        <label htmlFor="form_edit_name">Název firmy</label>
                        <input defaultValue={settings.name} type="text" name="settings[name]"
                               className="form-control"
                               id="form_edit_name"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_ic">IČ firmy</label>
                        <input defaultValue={settings.ic} type="text" name="settings[ic]"
                               className="form-control"
                               id="form_edit_ic"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_dic">DIČ firmy</label>
                        <input defaultValue={settings.dic} type="text" name="settings[dic]"
                               className="form-control"
                               id="form_edit_dic"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_address">Adresa firmy</label>
                        <textarea defaultValue={settings.address} rows="4" name="settings[address]"
                                  className="form-control"
                                  id="form_edit_address"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_phone">Telefon</label>
                        <input defaultValue={settings.phone} type="text" name="settings[phone]"
                               className="form-control"
                               id="form_edit_phone"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_email">E-mail</label>
                        <input defaultValue={settings.email} type="text" name="settings[email]"
                               className="form-control"
                               id="form_edit_email"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_web">Web</label>
                        <input defaultValue={settings.web} type="text" name="settings[web]"
                               className="form-control"
                               id="form_edit_web"/>
                    </div>
                </div>
                <div className="col-12 col-md-4">
                    <h2 className="h5 mb-3">Fakturační nastavení</h2>
                    <div className="mb-3">
                        <label htmlFor="form_edit_bank">Banka</label>
                        <input defaultValue={settings.bank} type="text" name="settings[bank]"
                               className="form-control"
                               id="form_edit_bank"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_account_number">Číslo účtu</label>
                        <input defaultValue={settings.account_number} type="text" name="settings[account_number]"
                               className="form-control"
                               id="form_edit_account_number"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_swift">Swift kód</label>
                        <input defaultValue={settings.swift} type="text" name="settings[swift]"
                               className="form-control"
                               id="form_edit_swift"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_iban">IBAN</label>
                        <input defaultValue={settings.iban} type="text" name="settings[iban]"
                               className="form-control"
                               id="form_edit_iban"/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="form_edit_invoice_note">Poznámka ve faktuře</label>
                        <textarea defaultValue={settings.invoice_note} rows="4" name="settings[invoice_note]"
                                  className="form-control"
                                  id="form_edit_invoice_note"/>
                    </div>
                </div>
            </div>
            <button type="submit" className="btn btn-primary">
                Uložit
            </button>
        </form>
    );
}

export default SettingsBaseForm;