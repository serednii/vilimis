import React, { memo } from "react";

const TimeTrackerChartSelectDate = ({
  selectYear,
  setSelectYear,
  selectedMonth,
  setSelectedMonth,
  dataYearMonth,
  isAllDays,
  setIsAllDays,
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
    <div className="mb-5 d-flex flex-wrap gap-2 ps-2">
      <div className="time-tracker-chart__select ">
        <select
          className="form-select"
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
          className="form-select"
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
      <div className="pt-2">
        <input
          className="form-check-input me-2"
          type="checkbox"
          checked={isAllDays}
          onClick={(event) => setIsAllDays((prev) => !prev)}
          value=""
          id="flexCheckDefault"
        />
        <label className="form-check-label" htmlFor="flexCheckDefault">
          Všechny dny v měsíci
        </label>
      </div>
    </div>
  );
};
export default memo(TimeTrackerChartSelectDate);
