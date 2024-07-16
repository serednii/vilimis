import MD5 from "crypto-js/md5";
import {SignOut, User} from "@phosphor-icons/react";
import React, {useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import ProfilFormModal from "../Profil/ProfilFormModal";

const TopUserInfo = () => {
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const {user, logout, reloadUser} = useRootContext();
    const [modalIsOpen, setIsOpen] = React.useState(false);

    return (<>

        <a onClick={() => setShowUserDropdown(!showUserDropdown)}
           className="nav-link dropdown-toggle pt-1 px-0" href="#" role="button"
           data-bs-toggle="dropdown"
           aria-expanded="false">
            <div className="media d-flex align-items-center">
                <img className="avatar rounded-circle" alt="Image placeholder"
                     src={user.avatar ? user.avatar : "http://www.gravatar.com/avatar/" + MD5(user.username) + "?s=64&d=mm"}/>
                <div
                    className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                                                <span
                                                    className="mb-0 font-small fw-bold text-gray-900">{user.name} {user.surname}</span>
                </div>
            </div>
        </a>
        <div
            className="dropdown-menu dashboard-dropdown dropdown-menu-end mt-2 py-1"
            style={{
                opacity: showUserDropdown ? 1 : 0,
                pointerEvents: showUserDropdown ? "all" : "none"
            }}
        >
            <button onClick={()=>setIsOpen(true)} className="dropdown-item d-flex align-items-center" href="#">
                <User size={16} className="me-2"/>
                Profil
            </button>
            <div role="separator" className="dropdown-divider my-1"></div>

            <button onClick={logout}
                    className="dropdown-item d-flex align-items-center" href="#">
                <SignOut size={16} color={"red"} className="me-2"/>
                Odhlásit
            </button>
        </div>


        {modalIsOpen && (
            <ProfilFormModal
                isOpen={modalIsOpen}
                onRequestClose={()=>setIsOpen(false)}
                callback={()=>{reloadUser();setIsOpen(false);}}
                id={user.id} />
        )}
    </>);
};

export default TopUserInfo;