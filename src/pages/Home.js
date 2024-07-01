import { useRootContext } from "../contexts/RootContext";
import TasksListDashboard from "../components/Dashboard/TasksListDashboard";
import TaskTimetracksListDashboard from "../components/Dashboard/TaskTimetracksListDashboard";
import ProjectDatesListDashboard from "../components/Dashboard/ProjectDatesListDashboard";
import TimeTrackerChart from "../components/Dashboard/TimeTrackerChart";

const Home = ({ }) => {
    return (
        <>
            <div>
                <TimeTrackerChart />
            </div>
            <div className="row">
                <div className="col-12 col-md-6 col-xxl-4 mb-4">
                    <ProjectDatesListDashboard />
                </div>
                <div className="col-12 col-md-6 col-xxl-4 mb-4">
                    <TasksListDashboard />
                </div>
                <div className="col-12 col-md-6 col-xxl-4 mb-4">
                    <TaskTimetracksListDashboard />
                </div>
            </div>

        </>
    );
};

export default Home;