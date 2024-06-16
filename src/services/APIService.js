import Home from "../pages/Home";
import {LOADER_ACTIONS} from "../reducers/loaderReducer";
import {CONFIG} from "../config";
class APIService {
    constructor(loaderDispatch, toast) {
        this.loaderDispatch = loaderDispatch;
        this.toast = toast;
    }

    async getData(url, callback) {
        this.loaderDispatch({action: LOADER_ACTIONS.SHOW});
        const response = await fetch(CONFIG.api + url, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                "Accept": "application/json"
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer'
        });
        this.loaderDispatch({action: LOADER_ACTIONS.HIDE});
        return response.json().then((data) => {
            if ("message" in data) {
                if ("code" in data && data.code.toString().substring(0,1) === "2") {
                    this.toast.success(data.message);
                } else if ("code" in data && data.code.toString().substring(0,1) === "4") {
                    this.toast.error(data.message);
                } else if ("code" in data && data.code.toString().substring(0,1) === "5") {
                    this.toast.error(data.message);
                } else {
                    this.toast(data.message);
                }
            }

            if (callback) {
                if ("data" in data) {
                    callback(data.data);
                    return;
                }

                callback(data);
            }
        });
    }

    async postData(url = '', formData, callback) {
        this.loaderDispatch({action: LOADER_ACTIONS.SHOW});
        // Default options are marked with *
        const response = await fetch(CONFIG.api + url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                // 'Content-Type': 'application/json'
                //'Content-Type': 'multipart/form-data',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            // body: JSON.stringify(data) // body data type must match "Content-Type" header
            body: formData // body data type must match "Content-Type" header
        });
        this.loaderDispatch({action: LOADER_ACTIONS.HIDE});

        return response.json().then((data) => {
            if ("message" in data) {
                if ("code" in data && data.code.toString().substring(0,1) === "2") {
                    this.toast.success(data.message);
                } else if ("code" in data && data.code.toString().substring(0,1) === "4") {
                    this.toast.error(data.message);
                } else if ("code" in data && data.code.toString().substring(0,1) === "5") {
                    this.toast.error(data.message);
                } else {
                    this.toast(data.message);
                }
            }

            if (callback) {
                if ("data" in data) {
                    callback(data.data);
                    return;
                }

                callback(data);
            }
        });
    }
}
export default APIService;