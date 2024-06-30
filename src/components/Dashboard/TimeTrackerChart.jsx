import { BarChart } from "@mui/x-charts/BarChart";
import { workDataTime } from "./weather";
import { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import {
  getNewFormatData,
  functionFilterData,
  splitNumber,
  sortDay,
} from "./timeTrackerUtils";
import TimeTrackerChartSelectDate from "./TimeTrackerChartSelectDate";

const chartSetting = {
  yAxis: [
    {
      label: "working hours (hod)",
      // max: 10, // Nastavíme maximální hodnotu Y stupnice
    },
  ],
  height: 300,
  // sx: {
  //   [`.${axisClasses.left} .${axisClasses.label}`]: {
  //     transform: "translate(-20px, 0)",
  //   },
  // },
};

const valueFormatter = (value) => {
  const parts = splitNumber(value);
  if (parts.decimalPart !== 0) {
    return `${parts.integerPart} hod  ${parts.decimalPart} min`;
  } else {
    return `${parts.integerPart} hod `;
  }
};

const TimeTrackerChart = () => {
  const { API } = useRootContext();
  const [newFormatData, setNewFormatData] = useState(null);
  const [selectYear, setSelectYear] = useState(null); //last year
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [filterData, setFilterData] = useState(null);

  useEffect(() => {
    API.getData("/taskTimetrack/list", (taskTimetracks) => {
      // const newFormatData = getNewFormatData(taskTimetracks);
      const newFormatData = getNewFormatData(workDataTime);
      const [lastYear] = newFormatData.objYearAndMonth.allYear.slice(-1);
      const [lastMonth] = newFormatData.objYearAndMonth[lastYear].slice(-1);
      setSelectYear(lastYear);
      setSelectedMonth(lastMonth);
      setNewFormatData(newFormatData);
    });
  }, []);

  useEffect(() => {
    if (selectYear && selectedMonth) {
      const filterData = newFormatData.arrayObjectWorkDay.filter((data) =>
        functionFilterData(data, selectYear, selectedMonth)
      );
      console.log("filterData", filterData);
      filterData.sort(sortDay);
      setFilterData(filterData);
    }
  }, [selectYear, selectedMonth]);

  return (
    <div>
      {newFormatData && selectYear && selectedMonth && (
        <TimeTrackerChartSelectDate
          selectYear={selectYear}
          setSelectYear={setSelectYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          dataYearMonth={newFormatData.objYearAndMonth}
        />
      )}
      {filterData && (
        <BarChart
          dataset={filterData}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "weekMonthDey",
            },
          ]}
          series={[
            {
              dataKey: "timeHour",
              label: selectYear + " " + selectedMonth,
              valueFormatter,
            },
          ]}
          {...chartSetting}
        />
      )}
    </div>
  );
};

export default TimeTrackerChart;
