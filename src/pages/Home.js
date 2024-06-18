import {useRootContext} from "../contexts/RootContext";
import TasksListDashboard from "../components/Dashboard/TasksListDashboard";
import TaskTimetracksListDashboard from "../components/Dashboard/TaskTimetracksListDashboard";

const Home = ({}) => {
    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 col-xxl-6 mb-4">
                    <TasksListDashboard/>
                </div>
                <div className="col-12 col-md-6 col-xxl-6 mb-4">
                    <TaskTimetracksListDashboard/>
                </div>
            </div>

        </>
    );
};

export default Home;