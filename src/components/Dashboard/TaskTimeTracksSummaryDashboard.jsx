import {BarChart} from "@mui/x-charts/BarChart";
import {workDataTime} from "./weather";
import {useEffect, useState} from "react";
import {useRootContext} from "../../contexts/RootContext";
import {
    getNewFormatData,
    functionFilterData,
    splitNumber,
    sortDay,
    addNewProperties,
    fillInTheMissingDays,
} from "./timeTrackerUtils";
import TimeTrackerChartSelectDate from "./TimeTrackerChartSelectDate";
import BudgetCalculator from "../../utils/BudgetCalculator";
import {PieChart} from "@mui/x-charts";


const TaskTimeTracksSummaryDashboard = () => {
    const {API} = useRootContext();
    const [data, setData] = useState(null); //last year
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        API.getData("/taskTimetracksSummary/", (data) => {
            setData(data);
            setLoading(false);
        });
    }, []);

    return (
        <div className="card border-0 shadow h-100">
            <div className="card-body">
                {loading ? (
                    <p>Načítání...</p>
                ) : (
                    <>
                        {data != null ? (
                            <>
                                <h2 className="h5">Tento měsíc:</h2>
                                <p>Odpracováno: {new BudgetCalculator(data.totalDataThisMonth.seconds).calculareSpendingHoursNicely()}</p>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>Dle projektů:</p>
                                        <PieChart
                                            margin={{ left: 0,bottom: 0, right: 0, top: 0 }}
                                            slotProps={{legend: {hidden: true}}}
                                            series={[
                                                {
                                                    data: data.projectDataThisMonth.map(p => {
                                                        return {id: p.id, value: p.seconds, label: p.name}
                                                    }),
                                                    valueFormatter: (value) => ((new BudgetCalculator(value.value)).calculareSpendingHoursNicely())
                                                },
                                            ]}
                                            height={200}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <p>Dle klientů:</p>
                                        <PieChart
                                            margin={{ left: 0,bottom: 0, right: 0, top: 0 }}
                                            slotProps={{legend: {hidden: true}}}
                                            series={[
                                                {
                                                    data: data.clientDataThisMonth.map(p => {
                                                        return {id: p.id, value: p.seconds, label: p.name}
                                                    }),
                                                    valueFormatter: (value) => ((new BudgetCalculator(value.value)).calculareSpendingHoursNicely())
                                                },
                                            ]}
                                            height={200}
                                        />
                                    </div>
                                </div>

                                {/*

                                <h2 className="h5">Minulý měsíc:</h2>
                                <p>Odpracováno: {new BudgetCalculator(data.totalDataLastMonth.seconds).calculareSpendingHoursNicely()}</p>
                                <div className="row">
                                    <div className="col-md-6">
                                        <p>Dle projektů:</p>
                                        <PieChart
                                            margin={{ right: 0, top: 0 }}
                                            slotProps={{legend: {hidden: true}}}
                                            series={[
                                                {
                                                    data: data.projectDataLastMonth.map(p => {
                                                        return {id: p.id, value: p.seconds, label: p.name}
                                                    }),
                                                    valueFormatter: (value) => ((new BudgetCalculator(value.value)).calculareSpendingHoursNicely())
                                                },
                                            ]}
                                            height={200}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <p>Dle klientů:</p>
                                        <PieChart
                                            margin={{ right: 0, top: 0 }}
                                            slotProps={{legend: {hidden: true}}}
                                            series={[
                                                {
                                                    data: data.clientDataLastMonth.map(p => {
                                                        return {id: p.id, value: p.seconds, label: p.name}
                                                    }),
                                                    valueFormatter: (value) => ((new BudgetCalculator(value.value)).calculareSpendingHoursNicely())
                                                },
                                            ]}
                                            height={200}
                                        />
                                    </div>
                                </div>*/}
                            </>
                        ) : (
                            <p>Žádná data</p>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskTimeTracksSummaryDashboard;
