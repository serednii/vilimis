import { nameWeekDay, nameMonth } from "./czechDateLabels";

//sbíráme za každý den všechny časové intervaly, kdy jsme pracovali
export const groupByTimeOfDay = (workDataTime) => {
  const arrayDayOfTime = {};
  workDataTime.forEach((el) => {
    const deltaTime =
      new Date(el.datetimeStop.date) - new Date(el.datetimeStart.date);
    const date = el.datetimeStart.date.split(" ")[0];
    if (arrayDayOfTime[date] === undefined) {
      arrayDayOfTime[date] = deltaTime;
    } else {
      arrayDayOfTime[date] = arrayDayOfTime[date] + deltaTime;
    }
  });
  return arrayDayOfTime
};

//analyzujeme všechna pole objektu po jednotlivých objektech
const separateObject = (obj) => {
  const arrayDay = [];
  for (const date in obj) {
    let hour = Math.floor(obj[date] / 1000 / 60 / 60);
    const minute = Math.floor(obj[date] / 1000 / 60);
    hour = hour + (minute - hour * 60) / 100;
    const weekDay = nameWeekDay[new Date(date).getDay()]
    const monthDay = new Date(date).getDate()
    arrayDay.push({
      date: date,
      weekMonthDey: monthDay + " " + weekDay.slice(0, 2),
      weekDay,
      monthDay,
      month: nameMonth[new Date(date).getMonth()],
      year: new Date(date).getFullYear(),
      timeMinute: minute,
      timeHour: hour,
    });
  }
  return arrayDay;
};

export const getYearAndMonth = (date) => {
  const setDate = new Set();
  const setYear = new Set();

  date.forEach((el) => {
    setDate.add(el.date.slice(0, 8) + "01");
    setYear.add(el.date.slice(0, 4));
  });

  const arrayDate = Array.from(setDate);
  const allYear = Array.from(setYear);

  const objArrayMonth = {};
  allYear.forEach((year) => {
    const month = arrayDate.filter((date) => date.slice(0, 4) === year);
    objArrayMonth[year] = month.map(
      (year) => nameMonth[new Date(year).getMonth()]
    );
  });
  objArrayMonth["allYear"] = allYear;
  return objArrayMonth;
};

export const functionFilterData = (data, lastYear, lastMonth) => {
  const year = data.date.slice(0, 4);
  const month = nameMonth[+data.date.slice(5, 7) - 1];
  return year === lastYear && month === lastMonth;
};

export const splitNumber = (num) => {
  const [integerPart, decimalPart] = num.toFixed(2).split(".");
  return {
    integerPart: parseInt(integerPart, 10),
    decimalPart: parseInt(decimalPart, 10),
  };
}

export const getNewFormatData = (workDataTime) => {
  const objTimeOfDay = groupByTimeOfDay(workDataTime)
  const arrayObjectWorkDay = separateObject(objTimeOfDay)
  const objYearAndMonth = getYearAndMonth(arrayObjectWorkDay)
  return { arrayObjectWorkDay, objYearAndMonth }
}

export const sortDay = (a, b) => {
  const aDateTime = new Date(a.date).getTime();
  const bDateTime = new Date(b.date).getTime();
  return aDateTime - bDateTime;
};

