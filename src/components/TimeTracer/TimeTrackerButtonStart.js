import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const timerTrackerButtonStart = ({ timeTrackerStart }) => {

    return (
        <div className="h-100 d-flex justify-content-sm-center align-items-center">
            <button className="tracker btn btn-danger" onClick={timeTrackerStart}>
                Start
            </button>
        </div>
    )
}

export default timerTrackerButtonStart;