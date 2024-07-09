import TasksListDashboard from "../components/Dashboard/TasksListDashboard";
import TaskTimetracksListDashboard from "../components/Dashboard/TaskTimetracksListDashboard";
import ProjectDatesListDashboard from "../components/Dashboard/ProjectDatesListDashboard";
import TimeTrackerChart from "../components/Dashboard/TimeTrackerChart";
import TaskTimeTracksSummaryDashboard from "../components/Dashboard/TaskTimeTracksSummaryDashboard";

const Home = ({ }) => {
    return (
        <>
            <div className="row">
                <div className="col-12 col-md-6 col-lg-4 mb-4">
                    <TaskTimeTracksSummaryDashboard/>
                </div>
                <div className="col-12 col-md-6 col-lg-8 mb-4">
                    <TimeTrackerChart/>
                </div>
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