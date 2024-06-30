// const nameWeekDay = [
//   "Neděle",
//   "Pondělí",
//   "Úterý",
//   "Středa",
//   "Čtvrtek",
//   "Pátek",
//   "Sobota",
// ];

// const nameMonth = [
//   "Leden",
//   "Únor",
//   "Březen",
//   "Duben",
//   "Květen",
//   "Červen",
//   "Červenec",
//   "Srpen",
//   "Září",
//   "Říjen",
//   "Listopad",
//   "Prosinec",
// ];

export const findInTree = (tree, type, id) => {
  return Object.entries(tree).reduce((acc, [lotId, children]) => {
    if (acc !== undefined) {
      return acc;
    }

    const index = (children[type] || []).findIndex((_id) => id === _id);
    if (index < 0) {
      return acc;
    }

    const parent = parseInt(lotId);
    return [parent, index];
  }, undefined);
};

export const heightBetweenCursorAndMiddle = (element, monitor) => {
  const hoverBoundingRect = element.getBoundingClientRect();
  const hoverMiddleY = (hoverBoundingRect.bottom + hoverBoundingRect.top) / 2;
  const clientOffset = monitor.getSourceClientOffset();
  const hoverClientY = clientOffset.y;
  return hoverClientY - hoverMiddleY;
};

export function parseTime(time) {
  const seconds = Math.round(time / 1000);
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return {
    d,
    h,
    m,
    s,
  };
}

// //збираємо за кожен день всі проміжки часу коли працювали
// export const groupByTimeOfDay = (workDataTime) => {
//   const arrayDayOfTime = {};
//   workDataTime.forEach((el) => {
//     const deltaTime =
//       new Date(el.datetimeStop.date) - new Date(el.datetimeStart.date);
//     const date = el.datetimeStart.date.split(" ")[0];

//     // console.log(typeof deltaTime);

//     if (arrayDayOfTime[date] === undefined) {
//       arrayDayOfTime[date] = deltaTime;
//     } else {
//       arrayDayOfTime[date] = arrayDayOfTime[date] + deltaTime;
//     }
//   });
//   // const arrayData = separateObject(arrayDayOfTime) //separate object
//   // const arrayYearAndMonth = getYearAndMonth(arrayData)
//   // return { arrayData, arrayYearAndMonth };
//   return separateObject(arrayDayOfTime);
// };

// //розбираємо всі поля обєкта по окремих обєктах
// const separateObject = (obj) => {
//   const arrayDay = [];
//   for (const date in obj) {
//     let hour = Math.floor(obj[date] / 1000 / 60 / 60);
//     const minute = Math.floor(obj[date] / 1000 / 60);
//     hour = hour + (minute - hour * 60) / 100;

//     arrayDay.push({
//       date: date,
//       weekDay: nameWeekDay[new Date(date).getDay()],
//       monthDay: new Date(date).getDate(),
//       month: nameMonth[new Date(date).getMonth()],
//       year: new Date(date).getFullYear(),
//       timeMinute: minute,
//       timeHour: hour,
//     });
//   }
//   return arrayDay;
// };

// export const getYearAndMonth = (date) => {
//   const setDate = new Set();
//   const setYear = new Set();

//   date.forEach((el) => {
//     setDate.add(el.date.slice(0, 8) + "01");
//     setYear.add(el.date.slice(0, 4));
//   });

//   const arrayDate = Array.from(setDate);
//   const allYear = Array.from(setYear);

//   const objArrayMonth = {};
//   allYear.forEach((year) => {
//     const month = arrayDate.filter((date) => date.slice(0, 4) === year);
//     objArrayMonth[year] = month.map(
//       (year) => nameMonth[new Date(year).getMonth()]
//     );
//   });
//   objArrayMonth["allYear"] = allYear;
//   console.log(objArrayMonth);
//   return objArrayMonth;
// };

// // При потребі сортуємо масив
// const sortDay = (a, b) => {
//   const aDateTime = new Date(Object.keys(a)).getTime();
//   const bDateTime = new Date(Object.keys(b)).getTime();
//   return aDateTime - bDateTime;
// };
// //опреділяє дельту між годинами
// // const { h, m, s } = parseTime(b - a);

// // console.log(parseTime(b - a));
// // console.log(a.getDate());
