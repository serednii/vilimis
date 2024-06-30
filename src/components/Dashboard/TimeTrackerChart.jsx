import { BarChart } from "@mui/x-charts/BarChart";
import { dataset, workDataTime } from "./weather";
import { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
// import { parseTime } from "../../utils";
import { getNewFormatData, nameMonth } from "./utils";

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

const functionFilterData = (data, lastYear, lastMonth) => {
  const year = data.date.slice(0, 4);
  const month = nameMonth[+data.date.slice(5, 7) - 1];
  // console.log("year", year);
  // console.log("month", month);
  // console.log("lastYear", lastYear);
  // console.log("lastMonth", lastMonth);
  console.log(year + " " + lastYear + "      " + month + " " + lastMonth);

  return year === lastYear && month === lastMonth;
};
function splitNumber(num) {
  const [integerPart, decimalPart] = num.toFixed(2).split(".");
  return {
    integerPart: parseInt(integerPart, 10),
    decimalPart: parseInt(decimalPart, 10),
  };
}
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

  // useEffect(() => {
  //   API.getData("/task/list", (tasks) => {
  // setArrayDayOfTime(tasks);
  // setArrayDayOfTime(groupByTimeOfDay(tasks))
  //   });
  // }, []);

  useEffect(() => {
    setTimeout(() => {
      const newFormatData = getNewFormatData(workDataTime);
      setNewFormatData(newFormatData);
    }, 1000);
  }, []);

  useEffect(() => {
    if (newFormatData) {
      const [lastYear] = newFormatData.objYearAndMonth.allYear.slice(-1);
      const [lastMonth] = newFormatData.objYearAndMonth[lastYear].slice(-1);
      setSelectYear(lastYear);
      setSelectedMonth(lastMonth);
    }
  }, [newFormatData]);

  useEffect(() => {
    console.log("selectYear", selectYear);
    console.log("selectedMonth", selectedMonth);

    if (selectYear && selectedMonth) {
      const filterData = newFormatData.arrayObjectWorkDay.filter((data) =>
        functionFilterData(data, selectYear, selectedMonth)
      );
      console.log(filterData);
      setFilterData(filterData);
    }
  }, [selectYear, selectedMonth]);

  console.log("newFormatData", newFormatData);

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
              label: selectYear + " " + selectedMonth,
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
