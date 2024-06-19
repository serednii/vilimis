import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TimeTrackerButton = ({ isShowSelect, setIsShowSelect }) => {

    const handleClick = () => {
        setIsShowSelect(!isShowSelect)
    }

    return (
        <div className="h-100 d-flex justify-content-sm-center align-items-center">
            <button className="text-default fw-bold   border-0" onClick={handleClick}>
                <FontAwesomeIcon icon={faClock} />
            </button>
        </div>
    )

}

export default TimeTrackerButton;