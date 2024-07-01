import React, { memo } from "react";

const TimeTrackerChartSelectDate = ({
  selectYear,
  setSelectYear,
  selectedMonth,
  setSelectedMonth,
  dataYearMonth,
}) => {
  const handleSelectedYear = (value) => {
    setSelectYear(value);
    const [lastMonth] = dataYearMonth[value].slice(-1);
    setSelectedMonth(lastMonth);
  };

  const handleSelectedMonth = (value) => {
    setSelectedMonth(value);
  };

  //   console.log("dataYearMonth", dataYearMonth);
  //   console.log(selectYear);
  //   console.log(selectedMonth);

  return (
    <div className="mb-5 d-flex gap-2 ps-2">
      <div className="time-tracker-chart__select ">
        <select
          class="form-select"
          value={selectYear}
          onChange={(event) => handleSelectedYear(event.target.value)}
          aria-label="Пример выбора по умолчанию"
        >
          {dataYearMonth.allYear.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="time-tracker-chart__select ">
        <select
          value={selectedMonth}
          class="form-select"
          onChange={(event) => handleSelectedMonth(event.target.value)}
          aria-label="Пример выбора по умолчанию"
        >
          {selectYear &&
            dataYearMonth[selectYear].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
        </select>
      </div>
    </div>
  );
};
export default memo(TimeTrackerChartSelectDate);
