import React, {useState} from "react";
import {useRootContext} from "../contexts/RootContext";

const Login = ({}) => {
    const {API, locale, setJwt} = useRootContext()
    const [error, setError] = useState(null)

    const handleSubmit = (event => {
        event.stopPropagation();
        event.preventDefault();

        let formData = new FormData(event.target);

        API.postData("/jwt/create", formData, (data) => {
            if ("jwt" in data) {
                console.log(data);
                localStorage.setItem("jwt", data.jwt);
                setJwt(data.jwt);
                setError(null);
            } else {
                setError(data.message)
            }
        });
    });

    return (
        <main>
            <section className="vh-lg-100 mt-5 mt-lg-0 bg-soft d-flex align-items-center">
                <div className="container">

                    <div className="row justify-content-center form-bg-image"
                         data-background-lg="../../assets/img/illustrations/signin.svg"
                    >
                        <div className="col-12 d-flex align-items-center justify-content-center">
                            <div className="bg-white shadow border-0 rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                                <div className="text-center text-md-center mb-4 mt-md-0">


                                    <img src="/gephart/images/logo-black.svg" width="203"
                                         alt="VilémIS Logo"/>

                                    <h1 className="mb-0 mt-5 h3">Přihlášení do systému</h1>
                                </div>

                                {error && (
                                    <p className="text-danger">
                                        {error}
                                    </p>
                                )}

                                <form onSubmit={handleSubmit} className="mt-4">
                                    <div className="form-group mb-4">
                                        <label htmlFor="email">E-mail</label>
                                        <div className="input-group">
                                            <span className="input-group-text"
                                                  id="basic-addon1">
                                                <svg
                                                    className="icon icon-xs text-gray-600" fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                    xmlns="http://www.w3.org/2000/svg"><path
                                                    d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path
                                                    d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg> </span>
                                            <input
                                                type="email" className="form-control" placeholder="milan@firma.cz"
                                                id="email" name="username" required={true}/>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <div className="form-group mb-4">
                                            <label htmlFor="password">Heslo</label>
                                            <div className="input-group">
                                                <span className="input-group-text"
                                                      id="basic-addon2">
                                                    <svg
                                                        className="icon icon-xs text-gray-600" fill="currentColor"
                                                        viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path
                                                        fillRule="evenodd"
                                                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                                        clipRule="evenodd"></path></svg> </span>
                                                <input type="password"
                                                       placeholder="Password"
                                                       className="form-control"
                                                       id="password"
                                                       name="password"
                                                       required={true}/></div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-top mb-4">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox"
                                                       value="" id="remember"/> <label
                                                className="form-check-label mb-0" htmlFor="remember">Zapamatovat</label>
                                            </div>
                                            {/*<div><a href="./forgot-password.html" className="small text-right">Lost
                                                password?</a></div>*/}
                                        </div>
                                    </div>
                                    <div className="d-grid">
                                        <button type="submit" className="btn btn-gray-800">Přihlásit</button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Login;