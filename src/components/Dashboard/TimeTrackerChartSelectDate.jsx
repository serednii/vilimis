import React, { memo } from "react";
import { useRootContext } from "../../contexts/RootContext";
import Select from "react-select";

const TimeTrackerChartSelectDate = ({
  selectYear,
  setSelectYear,
  selectedMonth,
  setSelectedMonth,
  dataYearMonth,
  isAllDays,
  setIsAllDays,
}) => {
  const { locale } = useRootContext();

  const handleSelectedYear = (selectedOption) => {
    setSelectYear(selectedOption.value);
    const [lastMonth] = dataYearMonth[selectedOption.value].slice(-1);
    setSelectedMonth(lastMonth);
  };

  const handleSelectedMonth = (selectedOption) => {
    setSelectedMonth(selectedOption.value);
  };

  const yearOptions = dataYearMonth.allYear.map((year) => ({
    value: year,
    label: year,
  }));

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isDisabled ? "#d3d3d3" : "#007bff",
      color: state.isDisabled ? "#000" : "#fff",
    }),
  };

  const monthOptions = locale._months_fullname.map((month) => {
    const isDisabled = !dataYearMonth[selectYear].includes(month);
    return {
      value: month,
      label: month,
      isDisabled,
    };
  });

  return (
    <div className="mb-5 d-flex flex-wrap gap-2 ps-2">
      <div className="time-tracker-chart__select">
        <Select
          value={yearOptions.find((option) => option.value === selectYear)}
          onChange={handleSelectedYear}
          options={yearOptions}
        />
      </div>
      <div className="time-tracker-chart__select">
        <Select
          value={monthOptions.find((option) => option.value === selectedMonth)}
          onChange={handleSelectedMonth}
          options={monthOptions}
          styles={customStyles}
          isOptionDisabled={(option) => option.isDisabled}
        />
      </div>
      <div className="d-flex align-items-center ">
        <input
          className="form-check-input me-2"
          type="checkbox"
          checked={isAllDays}
          onChange={() => setIsAllDays((prev) => !prev)}
          value=""
          id="flexCheckDefault"
        />
        <label className="form-check-label mb-0" htmlFor="flexCheckDefault">
          Všechny dny v měsíci
        </label>
      </div>
    </div>
  );
};

export default memo(TimeTrackerChartSelectDate);

// import React, { memo } from "react";
// import { useRootContext } from "../../contexts/RootContext";

const TimeTrackerChartSelectDate1 = ({
  selectYear,
  setSelectYear,
  selectedMonth,
  setSelectedMonth,
  dataYearMonth,
  isAllDays,
  setIsAllDays,
}) => {
  const { locale } = useRootContext();
  console.log(locale);

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
          value={selectYear}
          onChange={(event) => handleSelectedYear(event.target.value)}
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
          onChange={(event) => handleSelectedMonth(event.target.value)}
        >
          {selectYear &&
            locale._months_fullname.map((month) => {
              const isDisabled = dataYearMonth[selectYear].includes(month);
              return (
                <option
                  className={isDisabled ? "text-bg-success" : "text-bg-primary"}
                  disabled={!isDisabled}
                  key={month}
                  value={month}
                >
                  {month}
                </option>
              );
            })}
        </select>
      </div>
      <div className="pt-2">
        <input
          className="form-check-input me-2"
          type="checkbox"
          checked={isAllDays}
          onClick={() => setIsAllDays((prev) => !prev)}
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
// export default memo(TimeTrackerChartSelectDate);
