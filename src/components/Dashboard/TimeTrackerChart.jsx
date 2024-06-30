import { BarChart } from "@mui/x-charts/BarChart";
import { dataset, workDataTime } from "./weather";
import { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import { groupByTimeOfDay, getYearAndMonth, parseTime } from "../../utils";
import TimeTrackerChartSelectDate from "./TimeTrackerChartSelectDate";

// console.log(workDataTime);

const chartSetting = {
  yAxis: [
    {
      label: "working hours (hod)",
      max: 10, // Встановлюємо максимальне значення шкали Y
    },
  ],
  height: 300,
  // sx: {
  //   [`.${axisClasses.left} .${axisClasses.label}`]: {
  //     transform: "translate(-20px, 0)",
  //   },
  // },
};

const valueFormatter = (value) => `${value.toFixed(2)} hod`;

const TimeTrackerChart = () => {
  const { API } = useRootContext();
  const [arrayDayOfTime, setArrayDayOfTime] = useState(null);
  const [dataYearMonth, setDataYearMonth] = useState(null);

  // useEffect(() => {
  //   API.getData("/task/list", (tasks) => {
  // setArrayDayOfTime(tasks);
  // setArrayDayOfTime(groupByTimeOfDay(tasks))
  //   });
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      setArrayDayOfTime(groupByTimeOfDay(workDataTime));
    }, 1000);
  }, []);

  useEffect(() => {
    if (arrayDayOfTime) setDataYearMonth(getYearAndMonth(arrayDayOfTime));
  }, [arrayDayOfTime]);

  console.log("arrayDay", arrayDayOfTime);

  return (
    <div>
      {dataYearMonth && (
        <TimeTrackerChartSelectDate dataYearMonth={dataYearMonth} />
      )}
      {arrayDayOfTime && (
        <BarChart
          dataset={arrayDayOfTime}
          // dataset={dataset}
          xAxis={[
            {
              scaleType: "band",
              // dataKey: "month"
              dataKey: "monthDay",
            },
          ]}
          series={[
            // { dataKey: "time", label: "time", valueFormatter },
            {
              dataKey: "timeHour",
              label: "timeHour",
              valueFormatter,
            },
            // { dataKey: "paris", label: "Paris", valueFormatter },
            // { dataKey: "newYork", label: "New York", valueFormatter },
            // { dataKey: "seoul", label: "Seoul", valueFormatter },
          ]}
          {...chartSetting}
        />
      )}
    </div>
  );
};

export default TimeTrackerChart;
