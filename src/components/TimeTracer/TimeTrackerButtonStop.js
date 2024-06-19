import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TimeTrackerButtonStop = ({ timeTrackerStop }) => {

    return (
        <div className="h-100 d-flex justify-content-sm-center align-items-center">
            <button className="tracker btn btn-danger" onClick={timeTrackerStop}>
                Stop
            </button>
        </div>
    )

}

export default TimeTrackerButtonStop;