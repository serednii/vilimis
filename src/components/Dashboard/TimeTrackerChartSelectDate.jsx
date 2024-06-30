import { useState } from "react";

const TimeTrackerChartSelectDate = ({ dataYearMonth }) => {
  const [selectYear, setSelectYear] = useState(dataYearMonth.allYear.slice(-1)); //last year
  const [selectedMonth, setSelectedMonth] = useState(
    dataYearMonth[selectYear].slice(-1)
  );

  const handleSelectedYear = (value) => {
    setSelectYear(value);
    setSelectedMonth(dataYearMonth[value].slice(-1));
  };

  const handleSelectedMonth = (value) => {
    setSelectedMonth(value);
  };

  console.log(selectYear);
  console.log(selectedMonth);

  return (
    <div className="mb-5 d-flex gap-2 ps-2">
      <div className="time-tracker-chart__select ">
        <select
          class="form-select"
          onChange={(event) => handleSelectedYear(event.target.value)}
          aria-label="Пример выбора по умолчанию"
        >
          <option selected>{selectYear}</option>
          {dataYearMonth.allYear.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="time-tracker-chart__select ">
        <select
          class="form-select"
          onChange={(event) => handleSelectedMonth(event.target.value)}
          aria-label="Пример выбора по умолчанию"
        >
          <option selected>{selectedMonth}</option>
          {dataYearMonth[selectYear].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TimeTrackerChartSelectDate;

// import { useState } from "react";

// const TimeTrackerChartSelectDate = ({
//   dataYearMonth,
//   selectYear,
//   setSelectYear,
//   selectedMonth,
//   setSelectedMonth,
// }) => {
//   const handleSelectedYear = (value) => {
//     setSelectYear(value);
//     // setSelectedMonth(dataYearMonth[value]?.slice(-1));
//   };

//   const handleSelectedMonth = (value) => {
//     setSelectedMonth(value);
//   };

//   console.log(selectYear);
//   console.log(selectedMonth);

//   return (
//     <div className="mb-5 d-flex gap-2 ps-2">
//       <div className="time-tracker-chart__select ">
//         <select
//           class="form-select"
//           onChange={(event) => handleSelectedYear(event.target.value)}
//           aria-label="Пример выбора по умолчанию"
//         >
//           <option selected>{selectYear}</option>
//           {dataYearMonth.allYear.map((year) => (
//             <option key={year} value={year}>
//               {year}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div className="time-tracker-chart__select ">
//         <select
//           class="form-select"
//           onChange={(event) => handleSelectedMonth(event.target.value)}
//           aria-label="Пример выбора по умолчанию"
//         >
//           <option selected>{selectedMonth}</option>
//           {dataYearMonth[selectYear].map((month) => (
//             <option key={month} value={month}>
//               {month}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default TimeTrackerChartSelectDate;
