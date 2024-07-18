import { BarChart } from "@mui/x-charts/BarChart";
import { workDataTime } from "./weather";
import { useEffect, useState } from "react";
import { useRootContext } from "../../contexts/RootContext";
import {
  getNewFormatData,
  functionFilterData,
  splitNumber,
  sortDay,
  addNewProperties,
  fillInTheMissingDays,
} from "./timeTrackerUtils";
import TimeTrackerChartSelectDate from "./TimeTrackerChartSelectDate";

const chartSetting = {
  yAxis: [
    {
      label: "hodiny",
      // max: 10, // Nastavíme maximální hodnotu Y stupnice
    },
  ],
  height: 340,
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
  const [finalData, setFinalData] = useState([]);
  const [isAllDays, setIsAllDays] = useState(true);

  useEffect(() => {
    API.getData("/taskTimetrack/list?order=datetime_start", (taskTimetracks) => {
      const newFormatData = getNewFormatData(taskTimetracks.data);
      //const newFormatData = getNewFormatData(workDataTime);
      if (newFormatData?.length >0) {
        const [lastYear] = newFormatData.objYearAndMonth.allYear.slice(-1);
        const [lastMonth] = newFormatData.objYearAndMonth[lastYear].slice(-1);
        setSelectYear(lastYear);
        setSelectedMonth(lastMonth);
        setNewFormatData(newFormatData);
      }
    });
  }, []);

  useEffect(() => {
    if (selectYear && selectedMonth) {
      let filterData = newFormatData.separateObjectIntoArray.filter((data) =>
        functionFilterData(data, selectYear, selectedMonth)
      );

      if (filterData.length === 0) {
        setFinalData([]);
        return;
      }
      if (isAllDays) {
        filterData = fillInTheMissingDays(filterData);
      }

      const finalDataProperties = addNewProperties(filterData);
      setFinalData(finalDataProperties);
    }
  }, [selectYear, selectedMonth, isAllDays]);

  return (
      <div className="card border-0 shadow  h-100">
        <div className="card-body">
    <div>
      {/*
      {selectYear && selectedMonth && (
        <TimeTrackerChartSelectDate
          selectYear={selectYear}
          setSelectYear={setSelectYear}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          isAllDays={isAllDays}
          setIsAllDays={setIsAllDays}
          dataYearMonth={newFormatData.objYearAndMonth}
        />
      )}
      */}
      {finalData && (
        <BarChart
          dataset={finalData}
          margin={{ left:15, right: 0, top: 10, bottom:20 }}
          xAxis={[
            {
              scaleType: "band",
              dataKey: "monthDay",
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
    </div>
      </div>
  );
};

export default TimeTrackerChart;
